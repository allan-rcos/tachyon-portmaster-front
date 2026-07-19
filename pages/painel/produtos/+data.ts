import type { PageContextServer } from 'vike/types';

import { listProducts } from '@/features/products/loaders/listProducts';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'products');
  const query = new URL(pageContext.urlOriginal, 'http://localhost').searchParams;
  const res = await listProducts(headers, query);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
