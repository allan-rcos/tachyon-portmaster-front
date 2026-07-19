import type { PageContextServer } from 'vike/types';

import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const locale = resolveLocale(pageContext.headers as IncomingHeaders);
  const t = loadMessages(locale, 'roles');
  return { t, title: t.new, description: t.subtitle };
}
