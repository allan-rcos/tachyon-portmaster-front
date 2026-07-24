import type { PageContextServer } from 'vike/types';

import { loginMessages, type LoginPageText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';

export interface Data {
  t: LoginPageText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const t = loginMessages(resolveLocale(pageContext.headers as IncomingHeaders));
  return { t, title: t.title, description: t.subtitle };
}
