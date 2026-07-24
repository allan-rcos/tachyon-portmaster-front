import type { PageContextServer } from 'vike/types';

import { productNewMessages, type ProductNewText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';

export interface Data {
  t: ProductNewText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const t = productNewMessages(resolveLocale(pageContext.headers as IncomingHeaders));
  return { t, title: t.new, description: t.subtitle };
}
