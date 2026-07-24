import type { Metrics } from 'tachyon-portmaster-sdk/metrics';
import type { PageContextServer } from 'vike/types';

import { painelMessages, type PainelPageText } from './messages';

import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import { getMetrics } from '@/features/metrics/loaders/getMetrics';

export interface Data {
  metrics: Metrics;
  t: PainelPageText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const headers = pageContext.headers as IncomingHeaders;
  const t = painelMessages(resolveLocale(headers));
  const metrics = await getMetrics(headers);
  return { metrics, t, title: t.title, description: t.subtitle };
}
