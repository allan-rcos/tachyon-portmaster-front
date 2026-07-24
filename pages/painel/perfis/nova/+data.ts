import type { PageContextServer } from 'vike/types';

import { roleNewMessages, type RoleNewText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';

export interface Data {
  t: RoleNewText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const t = roleNewMessages(resolveLocale(pageContext.headers as IncomingHeaders));
  return { t, title: t.new, description: t.subtitle };
}
