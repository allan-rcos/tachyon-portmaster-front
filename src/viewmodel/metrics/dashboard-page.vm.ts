// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { Metrics } from '@model/metrics';

import { painelMessages, type PainelPageText } from './i18n/dashboard-page.messages';
import { getMetrics } from './queries/get-metrics.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface DashboardPageData {
  metrics: Metrics;
  t: PainelPageText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadDashboardPage(request: PageRequest): Promise<DashboardPageData> {
  const headers = request.headers;
  const t = painelMessages(resolveLocale(headers));
  const metrics = await getMetrics(headers);
  return { metrics, t, title: t.title, description: t.subtitle };
}
