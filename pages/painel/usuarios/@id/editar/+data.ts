import type { PageContextServer } from 'vike/types';

import { listRoles } from '@/features/roles/loaders/listRoles';
import { getUser } from '@/features/users/loaders/getUser';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'users');
  const [user, roles] = await Promise.all([getUser(id, headers), listRoles(headers)]);
  return {
    id,
    user,
    roles: roles.data.map((r) => ({ id: r.id, name: r.name })),
    t,
    title: `${t.edit} ${user.name}`,
    description: t.subtitle,
  };
}
