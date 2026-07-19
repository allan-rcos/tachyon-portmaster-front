import type { PageContextServer } from 'vike/types';

import { getAccount } from '@/features/account/loaders/getAccount';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'account');
  const profile = await getAccount(headers);
  return { profile, t, title: t.title, description: t.subtitle };
}
