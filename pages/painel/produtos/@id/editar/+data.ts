import type { Product } from 'tachyon-portmaster-sdk/products';
import type { PageContextServer } from 'vike/types';

import { productEditMessages, type ProductEditText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import { getProduct } from '@/features/products/loaders/getProduct';

export interface Data {
  id: string;
  product: Product;
  t: ProductEditText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const t = productEditMessages(resolveLocale(headers));
  const product = await getProduct(id, headers);
  return { id, product, t, title: `${t.edit} ${product.name}`, description: t.subtitle };
}
