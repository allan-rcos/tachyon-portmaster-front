import type { AccountProfile } from 'tachyon-portmaster-sdk/account';
import type { PageContextServer } from 'vike/types';

import { accountMessages, type AccountPageText } from './messages';

import { getAccount } from '@/features/account/loaders/getAccount';
import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';

export interface Data {
  profile: AccountProfile;
  t: AccountPageText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const headers = pageContext.headers as IncomingHeaders;
  const t = accountMessages(resolveLocale(headers));
  const profile = await getAccount(headers);
  return { profile, t, title: t.title, description: t.subtitle };
}
