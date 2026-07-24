import type { UserAdmin } from 'tachyon-portmaster-sdk/users';
import type { PageContextServer } from 'vike/types';

import { usersListMessages } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import type { UserListText } from '@/features/users/components/UserList';
import { listUsers } from '@/features/users/loaders/listUsers';

export interface Data {
  items: UserAdmin[];
  total: number;
  t: UserListText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const headers = pageContext.headers as IncomingHeaders;
  const t = usersListMessages(resolveLocale(headers));
  const query = new URL(pageContext.urlOriginal, 'http://localhost').searchParams;
  const res = await listUsers(headers, query);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
