import type { Role } from 'tachyon-portmaster-sdk/roles';
import { render } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

import { rolePermissionsMessages, type RolePermissionsText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import { listRoles } from '@/features/roles/loaders/listRoles';

export interface Data {
  id: string;
  role: Role;
  t: RolePermissionsText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const t = rolePermissionsMessages(resolveLocale(headers));

  // Não há GET /roles/{id} — busca na listagem (poucos perfis).
  const res = await listRoles(headers);
  const role = res.data.find((r) => r.id === id);
  if (!role) throw render(404);

  return { id, role, t, title: `${t.syncPermissions} — ${role.name}`, description: t.subtitle };
}
