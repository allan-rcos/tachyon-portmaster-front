// ============================================================
//  Resolver de mocks para TESTES. Roteia method+path (+query/body)
//  contra o `db` in-memory e devolve o MESMO shape dos DTOs do swagger.
//  Auth por cookie. Usado pelos handlers MSW (test/msw/handlers.ts).
//
//  Infra de teste — não faz parte do bundle do app.
// ============================================================

import type { Paged, Permission, RiskClass } from 'tachyon-portmaster-sdk/common';
import type { Container } from 'tachyon-portmaster-sdk/containers';

import { db, nextId, recalcWeight, type SeedContainer, type SeedUser } from './db';
import { MockApiError } from './error';

export interface MockReq {
  method: string;
  path: string;
  query: URLSearchParams;
  body?: unknown;
  cookie?: string;
}

// ---- Auth helpers ------------------------------------------
function tokenFromCookie(cookie?: string): string | null {
  if (!cookie) return null;
  const m = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function authUser(ctx?: string): SeedUser | null {
  const token = tokenFromCookie(ctx);
  if (!token) return null;
  const userId = token.replace(/^mock_/, '');
  return db.users.find((u) => u.id === userId) ?? null;
}

function requireAuth(cookie?: string): SeedUser {
  const u = authUser(cookie);
  if (!u) throw new MockApiError(401, 'Não autenticado');
  return u;
}

// ---- Utils --------------------------------------------------
function paginate<T>(items: T[], query: URLSearchParams): Paged<T> {
  const limit = Math.max(1, Number(query.get('limit') || '20'));
  const start = Math.max(0, Number(query.get('cursor') || '0'));
  const data = items.slice(start, start + limit);
  const next = start + limit;
  return { data, total: items.length, next_cursor: next < items.length ? String(next) : undefined };
}

function toContainer(c: SeedContainer): Container {
  return {
    id: c.id,
    code: c.code,
    current_weight: c.current_weight,
    max_capacity: c.max_capacity,
    status: c.status,
  };
}

function containerById(id: string): SeedContainer {
  const c = db.containers.find((x) => x.id === id);
  if (!c) throw new MockApiError(404, 'Contêiner não encontrado');
  return c;
}

function summaryOf(c: SeedContainer) {
  return {
    container: toContainer(c),
    manifest: c.manifest,
    recent_logs: c.logs.slice(-8).reverse(),
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function segAfter(path: string, base: string): string | null {
  if (!path.startsWith(base + '/')) return null;
  const rest = path.slice(base.length + 1);
  return rest.length ? rest : null;
}

function publicUser(u: SeedUser) {
  return { id: u.id, name: u.name, email: u.email, roles: u.roles };
}

// ---- Roteador ----------------------------------------------
export function resolveMock(req: MockReq): unknown {
  const { method, path, query, cookie } = req;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (req.body ?? {}) as Record<string, any>;

  // ---------- AUTH ----------
  if (method === 'POST' && path === '/v1/auth/login') {
    const user = db.users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) throw new MockApiError(401, 'Credenciais inválidas');
    return {
      token: `mock_${user.id}`,
      token_type: 'Bearer',
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  // ---------- ACCOUNT ----------
  if (path === '/v1/account') {
    const me = requireAuth(cookie);
    if (method === 'GET') return { id: me.id, name: me.name, email: me.email, roles: me.roles };
    if (method === 'PUT') {
      me.name = body.name ?? me.name;
      me.email = body.email ?? me.email;
      return { id: me.id, name: me.name, email: me.email, roles: me.roles };
    }
  }
  if (path === '/v1/account/password' && method === 'PUT') {
    const me = requireAuth(cookie);
    if (me.password !== body.current_password) throw new MockApiError(422, 'Senha atual incorreta');
    me.password = body.new_password;
    return null;
  }

  // ---------- METRICS ----------
  if (path === '/v1/metrics' && method === 'GET') {
    requireAuth(cookie);
    const cs = db.containers;
    const div = {
      empty: cs.filter((c) => c.status === 'Empty').length,
      loading: cs.filter((c) => c.status === 'Loading').length,
      sealed: cs.filter((c) => c.status === 'Sealed').length,
      in_transit: cs.filter((c) => c.status === 'InTransit').length,
    };
    const capacity = cs.reduce((s, c) => s + c.max_capacity, 0);
    const weight = cs.reduce((s, c) => s + c.current_weight, 0);
    return {
      active_containers: cs.filter((c) => c.status !== 'Empty').length,
      total_containers: cs.length,
      yard_load: capacity ? Math.round((weight / capacity) * 1000) / 10 : 0,
      registered_products: db.products.length,
      occupancy_division: div,
    };
  }

  // ---------- CONTAINERS ----------
  if (path === '/v1/containers/summary' && method === 'GET') {
    requireAuth(cookie);
    const id = query.get('id');
    if (id) return { data: [summaryOf(containerById(id))], total: 1, next_cursor: undefined };
    return paginate(db.containers.map(summaryOf), query);
  }
  if (path === '/v1/containers') {
    requireAuth(cookie);
    if (method === 'GET') {
      let items = db.containers;
      const search = query.get('search')?.toLowerCase();
      if (search) items = items.filter((c) => c.code.toLowerCase().includes(search));
      const status = query.get('status');
      if (status) items = items.filter((c) => c.status === status);
      const statusIn = query.get('status_in');
      if (statusIn) {
        const set = new Set(statusIn.split(','));
        items = items.filter((c) => set.has(c.status));
      }
      return paginate(items.map(toContainer), query);
    }
    if (method === 'POST') {
      const c: SeedContainer = {
        id: nextId('ctr'),
        code: body.code,
        max_capacity: Number(body.max_capacity),
        current_weight: 0,
        status: 'Empty',
        manifest: [],
        logs: [
          {
            id: nextId('log'),
            event: 'Create',
            description: 'Contêiner registrado no pátio',
            timestamp: nowIso(),
          },
        ],
      };
      db.containers.unshift(c);
      return toContainer(c);
    }
  }
  {
    const sealId = segAfter(path, '/v1/containers');
    if (sealId?.endsWith('/seal') && method === 'POST') {
      requireAuth(cookie);
      const c = containerById(sealId.replace('/seal', ''));
      c.status = 'Sealed';
      c.logs.push({
        id: nextId('log'),
        event: 'Seal',
        description: 'Lacrado manualmente',
        timestamp: nowIso(),
      });
      return toContainer(c);
    }
    if (sealId?.endsWith('/dispatch') && method === 'POST') {
      requireAuth(cookie);
      const c = containerById(sealId.replace('/dispatch', ''));
      c.status = 'InTransit';
      c.logs.push({
        id: nextId('log'),
        event: 'Dispatch',
        description: 'Despachado para transporte',
        timestamp: nowIso(),
      });
      return toContainer(c);
    }
    if (sealId && !sealId.includes('/')) {
      requireAuth(cookie);
      const c = containerById(sealId);
      if (method === 'GET') return toContainer(c);
      if (method === 'PUT') {
        c.max_capacity = Number(body.max_capacity);
        return toContainer(c);
      }
      if (method === 'DELETE') {
        db.containers = db.containers.filter((x) => x.id !== sealId);
        return null;
      }
    }
  }

  // ---------- MANIFESTS ----------
  if (path === '/v1/manifests/load-item' && method === 'POST') {
    requireAuth(cookie);
    const c = containerById(body.container_id);
    const p = db.products.find((x) => x.id === body.product_id);
    if (!p) throw new MockApiError(404, 'Produto não encontrado');
    const qty = Number(body.quantity);
    const existing = c.manifest.find((m) => m.product_id === p.id);
    if (existing) {
      existing.quantity += qty;
      existing.weight = Math.round(existing.quantity * p.density * 100) / 100;
    } else {
      c.manifest.push({
        product_id: p.id,
        product_name: p.name,
        quantity: qty,
        weight: Math.round(qty * p.density * 100) / 100,
      });
    }
    recalcWeight(c);
    if (c.status === 'Empty') c.status = 'Loading';
    c.logs.push({
      id: nextId('log'),
      event: 'Load',
      description: `Carregado ${qty} un. de ${p.name}`,
      timestamp: nowIso(),
    });
    return { message: 'Item carregado', container: toContainer(c) };
  }
  if (path === '/v1/manifests/unload-item' && method === 'POST') {
    requireAuth(cookie);
    const c = containerById(body.container_id);
    const qty = Number(body.quantity);
    const existing = c.manifest.find((m) => m.product_id === body.product_id);
    if (!existing) throw new MockApiError(422, 'Produto não está no contêiner');
    const p = db.products.find((x) => x.id === body.product_id)!;
    existing.quantity -= qty;
    if (existing.quantity <= 0) {
      c.manifest = c.manifest.filter((m) => m.product_id !== body.product_id);
    } else {
      existing.weight = Math.round(existing.quantity * p.density * 100) / 100;
    }
    recalcWeight(c);
    if (c.manifest.length === 0) c.status = 'Empty';
    c.logs.push({
      id: nextId('log'),
      event: 'Unload',
      description: `Descarregado ${qty} un. de ${p.name}`,
      timestamp: nowIso(),
    });
    return { message: 'Item descarregado', container: toContainer(c) };
  }

  // ---------- PRODUCTS ----------
  if (path === '/v1/products') {
    requireAuth(cookie);
    if (method === 'GET') {
      let items = db.products;
      const search = query.get('search')?.toLowerCase();
      if (search) items = items.filter((p) => p.name.toLowerCase().includes(search));
      return paginate(items, query);
    }
    if (method === 'POST') {
      const p = {
        id: nextId('prd'),
        name: body.name,
        density: Number(body.density),
        risk_class: body.risk_class as RiskClass,
      };
      db.products.unshift(p);
      return p;
    }
  }
  {
    const id = segAfter(path, '/v1/products');
    if (id && !id.includes('/')) {
      requireAuth(cookie);
      const p = db.products.find((x) => x.id === id);
      if (!p) throw new MockApiError(404, 'Produto não encontrado');
      if (method === 'GET') return p;
      if (method === 'PUT') {
        Object.assign(p, {
          name: body.name,
          density: Number(body.density),
          risk_class: body.risk_class,
        });
        return p;
      }
      if (method === 'DELETE') {
        db.products = db.products.filter((x) => x.id !== id);
        return null;
      }
    }
  }

  // ---------- ROLES ----------
  if (path === '/v1/roles') {
    requireAuth(cookie);
    if (method === 'GET') return paginate(db.roles, query);
    if (method === 'POST') {
      const r = {
        id: nextId('rol'),
        name: body.name,
        user_count: 0,
        permissions: (body.permissions ?? []) as Permission[],
      };
      db.roles.unshift(r);
      return r;
    }
  }
  {
    const id = segAfter(path, '/v1/roles');
    if (id?.endsWith('/permissions') && method === 'PUT') {
      requireAuth(cookie);
      const r = db.roles.find((x) => x.id === id.replace('/permissions', ''));
      if (!r) throw new MockApiError(404, 'Perfil não encontrado');
      r.permissions = (body.permissions ?? []) as Permission[];
      return r;
    }
  }

  // ---------- USERS ----------
  if (path === '/v1/users') {
    requireAuth(cookie);
    if (method === 'GET') {
      let items = db.users;
      const search = query.get('search')?.toLowerCase();
      if (search)
        items = items.filter(
          (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search),
        );
      return paginate(items.map(publicUser), query);
    }
    if (method === 'POST') {
      const roles = db.roles.filter((r) => (body.role_ids ?? []).includes(r.id));
      const u: SeedUser = {
        id: nextId('usr'),
        name: body.name,
        email: body.email,
        password: body.initial_password,
        roles: roles.map((r) => ({
          id: r.id,
          name: r.name,
          user_count: r.user_count,
          permissions: r.permissions,
        })),
      };
      db.users.unshift(u);
      return publicUser(u);
    }
  }
  {
    const id = segAfter(path, '/v1/users');
    if (id) {
      requireAuth(cookie);
      const baseId = id.split('/')[0];
      const u = db.users.find((x) => x.id === baseId);
      if (!u) throw new MockApiError(404, 'Usuário não encontrado');
      if (id === baseId && method === 'GET') return publicUser(u);
      if (id === baseId && method === 'PUT') {
        u.name = body.name ?? u.name;
        u.email = body.email ?? u.email;
        return publicUser(u);
      }
      if (id === baseId && method === 'DELETE') {
        db.users = db.users.filter((x) => x.id !== baseId);
        return null;
      }
      if (id.endsWith('/password') && method === 'PUT') {
        u.password = body.new_password;
        return null;
      }
      if (id.endsWith('/roles') && method === 'PUT') {
        const roles = db.roles.filter((r) => (body.role_ids ?? []).includes(r.id));
        u.roles = roles.map((r) => ({
          id: r.id,
          name: r.name,
          user_count: r.user_count,
          permissions: r.permissions,
        }));
        return publicUser(u);
      }
    }
  }

  throw new MockApiError(404, `Rota mocada inexistente: ${method} ${path}`);
}
