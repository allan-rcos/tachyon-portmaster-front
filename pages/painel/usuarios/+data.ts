import type { PageContextServer } from 'vike/types';

import { listUsers } from '@/features/users/loaders/listUsers';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'users');
  const query = new URL(pageContext.urlOriginal, 'http://localhost').searchParams;
  const res = await listUsers(headers, query);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
