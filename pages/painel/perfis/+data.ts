import type { Role } from 'tachyon-portmaster-sdk/roles';
import type { PageContextServer } from 'vike/types';

import { rolesListMessages } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import type { RoleListText } from '@/features/roles/components/RoleList';
import { listRoles } from '@/features/roles/loaders/listRoles';

export interface Data {
  items: Role[];
  total: number;
  t: RoleListText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const headers = pageContext.headers as IncomingHeaders;
  const t = rolesListMessages(resolveLocale(headers));
  const res = await listRoles(headers);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
