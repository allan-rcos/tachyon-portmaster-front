import type { JSX } from 'solid-js';
import type { Metrics } from 'tachyon-portmaster-sdk/metrics';
import { ClientOnly } from 'vike-solid/ClientOnly';

import { OccupancyBreakdown } from './OccupancyBreakdown';
import { StatTiles } from './StatTiles';
import { OccupancyChart } from '../islands/OccupancyChart.island';

import { Card } from '@/features/core/components/Card';

/** Texto do painel de métricas (contrato do cluster — a página resolve). */
export interface MetricsPanelText {
  occupancy: string;
  activeContainers: string;
  totalContainers: string;
  yardLoad: string;
  registeredProducts: string;
  statusLoading: string;
  statusSealed: string;
  statusInTransit: string;
  statusEmpty: string;
}

/** Painel operacional (SSR): KPIs + divisão por status (donut island
 *  com a barra SSR como fallback). */
export function MetricsPanel(props: { metrics: Metrics; t: MetricsPanelText }): JSX.Element {
  return (
    <section>
      <StatTiles metrics={props.metrics} t={props.t} />
      <Card title={props.t.occupancy}>
        <ClientOnly
          fallback={<OccupancyBreakdown division={props.metrics.occupancy_division} t={props.t} />}
        >
          <OccupancyChart division={props.metrics.occupancy_division} t={props.t} />
        </ClientOnly>
      </Card>
    </section>
  );
}
