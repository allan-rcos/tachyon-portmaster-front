// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { Metrics } from './domain';
import { painelMessages } from './i18n/dashboard-page.messages';
import type { PainelPageText } from './i18n/dashboard-page.messages';
import { getMetrics } from './queries/get-metrics.query';
import { asyncBoundaryMessages, type AsyncBoundaryText } from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, type VMContext } from '../core/page/vm-context';

/** Superfície observável do painel operacional. */
export interface DashboardVM {
  t: PainelPageText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  metrics: AsyncSignal<Metrics, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel do painel de métricas.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createDashboardVM(context: VMContext = {}): DashboardVM {
  const t = painelMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const metrics = createAsyncSignal<Metrics, []>(() => getMetrics(context.headers));
  return { t, boundary, metrics, load: () => metrics.run() };
}

/** Título e descrição da rota, para o `<head>`. */
export function dashboardMeta(context: VMContext = {}): PageMeta {
  const t = painelMessages(contextLocale(context));
  return { title: t.title, description: t.subtitle };
}
