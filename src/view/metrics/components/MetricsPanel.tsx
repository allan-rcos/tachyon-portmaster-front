import { Card } from '@view/core/components/Card';
import type { DashboardVM } from '@viewmodel/metrics/dashboard-page.vm';
import type { JSX } from 'solid-js';

import { OccupancyBreakdown } from './OccupancyBreakdown';
import { StatTiles } from './StatTiles';

/** Props do painel operacional. */
export interface MetricsPanelProps {
  /** ViewModel da rota. */
  vm: DashboardVM;
}

/**
 * Painel operacional (SSR): KPIs + divisão do pátio por status.
 *
 * O donut do Chart.js saiu: o protótipo não tem nenhum gráfico, e ele era a
 * única razão de existir uma island com `<canvas>` — e, com ela, um `ClientOnly`
 * envolvendo conteúdo que o servidor já sabia desenhar.
 *
 * O protótipo traz ainda um painel de "atividade recente" ao lado da ocupação.
 * Ele não foi construído porque `GET /v1/metrics` devolve só contagens, sem
 * eventos — inventar a lista seria desenhar um dado que não existe.
 *
 * O protótipo traz ainda um painel de "atividade recente" ao lado da ocupação.
 * Ele não foi construído porque `GET /v1/metrics` não devolve eventos — só
 * contagens. Inventar a lista seria desenhar um dado que não existe.
 *
 * @param props.vm ViewModel da rota.
 */
export function MetricsPanel(props: MetricsPanelProps): JSX.Element {
  return (
    <section>
      <StatTiles tiles={props.vm.tiles} />
      <Card title={props.vm.t.occupancy}>
        <OccupancyBreakdown rows={props.vm.occupancy} label={props.vm.t.occupancy} />
      </Card>
    </section>
  );
}
