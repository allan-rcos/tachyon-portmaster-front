// ============================================================
//  Banco de dados in-memory para os TESTES (MSW). Seed rico que
//  simula o backend swagger. `resetDb()` re-semeia entre testes.
//  IDs são strings opacas. Pesos derivam do manifesto.
//
//  NOTA: isto é infraestrutura de teste — NÃO é importado pelo app
//  em runtime. O app fala com o swagger real via services/clients.
// ============================================================
import type { Permission } from '@model/common';
import { PERMISSION } from '@model/common';
import type {
  CargoManifestItem,
  Container,
  TelemetryLogItem,
} from '@model/containers';
import type { Product } from '@model/products';
import type { Role } from '@model/roles';
import type { UserAdmin } from '@model/users';

export interface SeedUser extends UserAdmin {
  password: string;
}

export interface SeedContainer extends Container {
  manifest: CargoManifestItem[];
  logs: TelemetryLogItem[];
}

export interface Db {
  seq: number;
  roles: Role[];
  users: SeedUser[];
  products: Product[];
  containers: SeedContainer[];
}

/** Peso atual = soma dos pesos do manifesto. */
export function recalcWeight(c: SeedContainer): void {
  c.current_weight = Math.round(c.manifest.reduce((s, m) => s + m.weight, 0) * 100) / 100;
}

function isoDaysAgo(days: number, hour = 9): string {
  const d = new Date('2026-07-16T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hour, 15, 0, 0);
  return d.toISOString();
}

function createSeed(): Db {
  const allPerms = [...PERMISSION] as Permission[];

  const roles: Role[] = [
    { id: 'rol_admin', name: 'Administrador', user_count: 1, permissions: allPerms },
    {
      id: 'rol_patio',
      name: 'Operador de pátio',
      user_count: 1,
      permissions: [
        'ContainerRead',
        'ContainerCreate',
        'ContainerUpdate',
        'ContainerSeal',
        'ContainerDispatch',
        'ContainerSummary',
        'ManifestLoad',
        'ManifestUnload',
        'ProductRead',
      ],
    },
    {
      id: 'rol_auditor',
      name: 'Auditor',
      user_count: 1,
      permissions: [
        'ContainerRead',
        'ContainerSummary',
        'ProductRead',
        'MetricsRead',
        'RoleList',
        'UserList',
      ],
    },
  ];

  const roleRef = (id: string) => {
    const r = roles.find((x) => x.id === id)!;
    return { id: r.id, name: r.name, user_count: r.user_count, permissions: r.permissions };
  };

  const users: SeedUser[] = [
    {
      id: 'usr_ana',
      name: 'Ana Marés',
      email: 'ana@portmaster.test',
      password: 'admin123',
      roles: [roleRef('rol_admin')],
    },
    {
      id: 'usr_bruno',
      name: 'Bruno Cais',
      email: 'bruno@portmaster.test',
      password: 'patio123',
      roles: [roleRef('rol_patio')],
    },
    {
      id: 'usr_celia',
      name: 'Célia Docas',
      email: 'celia@portmaster.test',
      password: 'audit123',
      roles: [roleRef('rol_auditor')],
    },
  ];

  const products: Product[] = [
    { id: 'prd_soja', name: 'Farelo de soja', density: 0.58, risk_class: 'None' },
    {
      id: 'prd_diesel',
      name: 'Óleo diesel S10',
      density: 0.84,
      risk_class: 'Class3FlammableLiquids',
    },
    { id: 'prd_amonia', name: 'Amônia anidra', density: 0.68, risk_class: 'Class2Gases' },
    {
      id: 'prd_fert',
      name: 'Nitrato de amônio',
      density: 1.72,
      risk_class: 'Class5OxidizingSubstances',
    },
    {
      id: 'prd_acido',
      name: 'Ácido sulfúrico',
      density: 1.84,
      risk_class: 'Class8CorrosiveSubstances',
    },
    { id: 'prd_cafe', name: 'Café verde em grãos', density: 0.67, risk_class: 'None' },
  ];

  const item = (p: Product, quantity: number): CargoManifestItem => ({
    product_id: p.id,
    product_name: p.name,
    quantity,
    weight: Math.round(quantity * p.density * 100) / 100,
  });

  const log = (
    id: string,
    event: TelemetryLogItem['event'],
    description: string,
    days: number,
  ): TelemetryLogItem => ({
    id,
    event,
    description,
    timestamp: isoDaysAgo(days),
  });

  const containers: SeedContainer[] = [
    {
      id: 'ctr_msku4410',
      code: 'MSKU-4410',
      max_capacity: 28000,
      status: 'Loading',
      current_weight: 0,
      manifest: [item(products[0], 12000), item(products[5], 4000)],
      logs: [
        log('log_1', 'Create', 'Contêiner registrado no pátio', 6),
        log('log_2', 'Load', 'Carregado 12.000 un. de Farelo de soja', 4),
        log('log_3', 'Load', 'Carregado 4.000 un. de Café verde em grãos', 2),
      ],
    },
    {
      id: 'ctr_tclu9982',
      code: 'TCLU-9982',
      max_capacity: 24000,
      status: 'Sealed',
      current_weight: 0,
      manifest: [item(products[1], 20000)],
      logs: [
        log('log_4', 'Create', 'Contêiner registrado no pátio', 8),
        log('log_5', 'Load', 'Carregado 20.000 un. de Óleo diesel S10', 5),
        log('log_6', 'Seal', 'Lacrado manualmente por Bruno Cais', 3),
      ],
    },
    {
      id: 'ctr_hlxu2201',
      code: 'HLXU-2201',
      max_capacity: 30000,
      status: 'InTransit',
      current_weight: 0,
      manifest: [item(products[3], 15000)],
      logs: [
        log('log_7', 'Create', 'Contêiner registrado no pátio', 12),
        log('log_8', 'Load', 'Carregado 15.000 un. de Nitrato de amônio', 9),
        log('log_9', 'Seal', 'Lacrado manualmente', 7),
        log('log_10', 'Dispatch', 'Despachado para o navio Atlântico Sul', 5),
      ],
    },
    {
      id: 'ctr_gesu0517',
      code: 'GESU-0517',
      max_capacity: 26000,
      status: 'Empty',
      current_weight: 0,
      manifest: [],
      logs: [log('log_11', 'Create', 'Contêiner registrado no pátio', 1)],
    },
    {
      id: 'ctr_ponu7743',
      code: 'PONU-7743',
      max_capacity: 22000,
      status: 'Loading',
      current_weight: 0,
      manifest: [item(products[4], 8000)],
      logs: [
        log('log_12', 'Create', 'Contêiner registrado no pátio', 3),
        log('log_13', 'Load', 'Carregado 8.000 un. de Ácido sulfúrico', 1),
      ],
    },
    {
      id: 'ctr_mrku3388',
      code: 'MRKU-3388',
      max_capacity: 28000,
      status: 'Sealed',
      current_weight: 0,
      manifest: [item(products[2], 9000), item(products[5], 6000)],
      logs: [
        log('log_14', 'Create', 'Contêiner registrado no pátio', 10),
        log('log_15', 'Load', 'Carregado 9.000 un. de Amônia anidra', 8),
        log('log_16', 'Load', 'Carregado 6.000 un. de Café verde em grãos', 6),
        log('log_17', 'Seal', 'Lacrado manualmente por Ana Marés', 4),
      ],
    },
    {
      id: 'ctr_dfsu6120',
      code: 'DFSU-6120',
      max_capacity: 25000,
      status: 'Empty',
      current_weight: 0,
      manifest: [],
      logs: [log('log_18', 'Create', 'Contêiner registrado no pátio', 2)],
    },
    {
      id: 'ctr_seku8091',
      code: 'SEKU-8091',
      max_capacity: 32000,
      status: 'Loading',
      current_weight: 0,
      manifest: [item(products[0], 18000)],
      logs: [
        log('log_19', 'Create', 'Contêiner registrado no pátio', 5),
        log('log_20', 'Load', 'Carregado 18.000 un. de Farelo de soja', 2),
      ],
    },
  ];
  containers.forEach(recalcWeight);

  return { seq: 100, roles, users, products, containers };
}

/** Estado mutável compartilhado pelo resolver de mocks (testes). */
export let db: Db = createSeed();

/** Re-semeia o banco (chamado no afterEach dos testes). */
export function resetDb(): void {
  db = createSeed();
}

/** Gera um id opaco novo com prefixo. */
export function nextId(prefix: string): string {
  db.seq += 1;
  return `${prefix}_${db.seq.toString(36)}`;
}
