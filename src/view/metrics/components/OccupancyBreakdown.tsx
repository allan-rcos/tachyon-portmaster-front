import type { Tone } from '@viewmodel/core/i18n/labels';
import { formatNumber } from '@viewmodel/core/utils/formatters';
import type { OccupancyDivision } from '@viewmodel/metrics/domain';
import { For, type JSX } from 'solid-js';

import type { MetricsPanelText } from './MetricsPanel';
import styles from './OccupancyBreakdown.module.scss';


/** Fatia da divisão de ocupação: um status, sua contagem e o tom da barra. */
export interface Segment {
  key: string;
  label: string;
  count: number;
  /** Tom do design system — tipado pela união para casar com o mapa de cores. */
  tone: Tone;
}

export function segmentsOf(div: OccupancyDivision, t: MetricsPanelText): Segment[] {
  return [
    { key: 'loading', label: t.statusLoading, count: div.loading, tone: 'gold' },
    { key: 'sealed', label: t.statusSealed, count: div.sealed, tone: 'sage' },
    { key: 'in_transit', label: t.statusInTransit, count: div.in_transit, tone: 'teal' },
    { key: 'empty', label: t.statusEmpty, count: div.empty, tone: 'neutral' },
  ];
}

/** Divisão por status: barra empilhada (CSS puro) + legenda. SSR. */
export function OccupancyBreakdown(props: {
  division: OccupancyDivision;
  t: MetricsPanelText;
}): JSX.Element {
  const segments = () => segmentsOf(props.division, props.t);
  const total = () => segments().reduce((s, x) => s + x.count, 0) || 1;

  return (
    <div>
      <div class={styles.bar} role="img" aria-label={props.t.occupancy}>
        <For each={segments()}>
          {(seg) => (
            <span
              class={styles.segment}
              data-tone={seg.tone}
              style={{ width: `${(seg.count / total()) * 100}%` }}
              hidden={seg.count === 0}
            />
          )}
        </For>
      </div>
      <dl class={styles.legend}>
        <For each={segments()}>
          {(seg) => (
            <div class={styles.item}>
              <dt>
                <span class={styles.dot} data-tone={seg.tone} aria-hidden="true" />
                {seg.label}
              </dt>
              <dd>{formatNumber(seg.count)}</dd>
            </div>
          )}
        </For>
      </dl>
    </div>
  );
}
