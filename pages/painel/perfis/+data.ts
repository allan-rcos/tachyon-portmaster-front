import type { PageContextServer } from 'vike/types';

import { listRoles } from '@/features/roles/loaders/listRoles';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'roles');
  const res = await listRoles(headers);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
