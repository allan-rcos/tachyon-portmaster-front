import { Card } from '@view/core/components/Card';
import type { Metrics } from '@viewmodel/metrics/domain';
import type { MetricsPanelText } from '@viewmodel/metrics/i18n/text-contracts';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

import { OccupancyBreakdown } from './OccupancyBreakdown';
import { StatTiles } from './StatTiles';
import { OccupancyChart } from '../islands/OccupancyChart.island';


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

export type { MetricsPanelText };
