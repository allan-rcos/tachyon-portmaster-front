import type { PageContextServer } from 'vike/types';

import { containerNewMessages, type ContainerNewText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';

export interface Data {
  t: ContainerNewText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const t = containerNewMessages(resolveLocale(pageContext.headers as IncomingHeaders));
  return { t, title: t.new, description: t.subtitle };
}
