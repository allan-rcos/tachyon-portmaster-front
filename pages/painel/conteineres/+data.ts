import type { PageContextServer } from 'vike/types';

import { listContainers } from '@/features/containers/loaders/listContainers';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'containers');
  const query = new URL(pageContext.urlOriginal, 'http://localhost').searchParams;
  const res = await listContainers(headers, query);
  return {
    items: res.data,
    total: res.total,
    nextCursor: res.next_cursor,
    filters: { search: query.get('search') ?? '', status: query.get('status') ?? '' },
    t,
    title: t.title,
    description: t.subtitle,
  };
}
