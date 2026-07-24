import type { Product } from 'tachyon-portmaster-sdk/products';
import type { PageContextServer } from 'vike/types';

import { productsListMessages } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import type { ProductListText } from '@/features/products/components/ProductList';
import { listProducts } from '@/features/products/loaders/listProducts';

export interface Data {
  items: Product[];
  total: number;
  t: ProductListText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const headers = pageContext.headers as IncomingHeaders;
  const t = productsListMessages(resolveLocale(headers));
  const query = new URL(pageContext.urlOriginal, 'http://localhost').searchParams;
  const res = await listProducts(headers, query);
  return { items: res.data, total: res.total, t, title: t.title, description: t.subtitle };
}
