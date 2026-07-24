import type { PageContextServer } from 'vike/types';

import { userNewMessages, type UserNewText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import { listRoles } from '@/features/roles/loaders/listRoles';

export interface Data {
  t: UserNewText;
  title: string;
  description: string;
  roles: { id: string; name: string }[];
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const headers = pageContext.headers as IncomingHeaders;
  const t = userNewMessages(resolveLocale(headers));
  const roles = await listRoles(headers);
  return {
    t,
    title: t.new,
    description: t.subtitle,
    roles: roles.data.map((r) => ({ id: r.id, name: r.name })),
  };
}
