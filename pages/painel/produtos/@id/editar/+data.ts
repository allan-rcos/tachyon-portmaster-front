import type { PageContextServer } from 'vike/types';

import { getProduct } from '@/features/products/loaders/getProduct';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'products');
  const product = await getProduct(id, headers);
  return { id, product, t, title: `${t.edit} ${product.name}`, description: t.subtitle };
}
