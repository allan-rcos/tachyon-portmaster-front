import { Icon, type IconName } from '@view/core/components/Icon';
import { formatNumber, formatPercent } from '@viewmodel/core/utils/formatters';
import type { Metrics } from '@viewmodel/metrics/domain';
import { For, type JSX } from 'solid-js';

import type { MetricsPanelText } from './MetricsPanel';
import styles from './StatTiles.module.scss';


interface Tile {
  label: string;
  value: string;
  icon: IconName;
  tone: string;
}

/** Cartões de KPI do painel (SSR). */
export function StatTiles(props: { metrics: Metrics; t: MetricsPanelText }): JSX.Element {
  const tiles = (): Tile[] => [
    {
      label: props.t.activeContainers,
      value: formatNumber(props.metrics.active_containers),
      icon: 'container',
      tone: 'gold',
    },
    {
      label: props.t.totalContainers,
      value: formatNumber(props.metrics.total_containers),
      icon: 'package',
      tone: 'teal',
    },
    {
      label: props.t.yardLoad,
      value: formatPercent(props.metrics.yard_load),
      icon: 'weight',
      tone: 'orange',
    },
    {
      label: props.t.registeredProducts,
      value: formatNumber(props.metrics.registered_products),
      icon: 'flask',
      tone: 'sage',
    },
  ];

  return (
    <ul class={styles.grid}>
      <For each={tiles()}>
        {(tile) => (
          <li class={styles.tile} data-tone={tile.tone}>
            <span class={styles.icon} aria-hidden="true">
              <Icon name={tile.icon} size={22} />
            </span>
            <span class={styles.value}>{tile.value}</span>
            <span class={styles.label}>{tile.label}</span>
          </li>
        )}
      </For>
    </ul>
  );
}
