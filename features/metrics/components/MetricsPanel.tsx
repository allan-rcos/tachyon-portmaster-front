import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

import { OccupancyBreakdown } from './OccupancyBreakdown';
import { StatTiles } from './StatTiles';
import { OccupancyChart } from '../islands/OccupancyChart.island';

import type { Metrics } from '@/services/gen/flow/v1/metrics';
import { Card } from '@/shared/components/Card';
import type { Messages } from '@/shared/i18n/messages/pt-BR';

/** Painel operacional (SSR): KPIs + divisão por status (donut island
 *  com a barra SSR como fallback). */
export function MetricsPanel(props: { metrics: Metrics; t: Messages }): JSX.Element {
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
