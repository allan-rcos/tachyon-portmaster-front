import { Toolbar } from '@view/core/components/Toolbar';
import { MetricsPanel } from '@view/metrics/components/MetricsPanel';
import type { DashboardVM } from '@viewmodel/metrics/dashboard-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela do painel operacional. */
export interface DashboardScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: DashboardVM;
}

/**
 * Tela do painel operacional. Stateless: as métricas já vieram resolvidas pelo
 * `+data`, então o HTML da primeira requisição já traz os números.
 *
 * Sem trilha de navegação: o painel é a raiz do app autenticado, e uma trilha
 * de um item só não informa nada.
 *
 * @param props.vm ViewModel da rota.
 */
export function DashboardScreen(props: DashboardScreenProps): TemplateResult {
  return html`${Toolbar({
    eyebrow: props.vm.t.eyebrow,
    title: props.vm.t.title,
    subtitle: props.vm.t.subtitle,
  })}
  ${MetricsPanel({ vm: props.vm })}`;
}
