import type { PageContextServer } from 'vike/types';

import { getMetrics } from '@/features/metrics/loaders/getMetrics';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'painel');
  const metrics = await getMetrics(headers);
  return { metrics, t, title: t.title, description: t.subtitle };
}
