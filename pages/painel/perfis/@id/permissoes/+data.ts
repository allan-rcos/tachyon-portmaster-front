import { render } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

import { listRoles } from '@/features/roles/loaders/listRoles';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'roles');

  // Não há GET /roles/{id} — busca na listagem (poucos perfis).
  const res = await listRoles(headers);
  const role = res.data.find((r) => r.id === id);
  if (!role) throw render(404);

  return { id, role, t, title: `${t.syncPermissions} — ${role.name}`, description: t.subtitle };
}
