/**
 * Composição de `/painel` — O painel — métricas agregadas do pátio.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { DashboardScreen } from '@view/metrics/screens/DashboardScreen';
import { createDashboardVM, type DashboardPageInput } from '@viewmodel/metrics/dashboard-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createDashboardVM(pageContext.data as DashboardPageInput);
  return () => DashboardScreen({ vm });
}
