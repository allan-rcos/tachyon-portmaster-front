import type { UserAdmin } from 'tachyon-portmaster-sdk/users';
import type { PageContextServer } from 'vike/types';

import { userEditMessages, type UserEditText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import { listRoles } from '@/features/roles/loaders/listRoles';
import { getUser } from '@/features/users/loaders/getUser';

export interface Data {
  id: string;
  user: UserAdmin;
  roles: { id: string; name: string }[];
  t: UserEditText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const t = userEditMessages(resolveLocale(headers));
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
