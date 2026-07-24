import { Chart } from 'chart.js/auto';
import { onMount, onCleanup, For, type JSX } from 'solid-js';
import type { OccupancyDivision } from 'tachyon-portmaster-sdk/metrics';

import styles from './OccupancyChart.island.module.scss';
import type { MetricsPanelText } from '../components/MetricsPanel';
import { segmentsOf } from '../components/OccupancyBreakdown';

import { formatNumber } from '@/features/core/utils/formatters';

const TONE_VAR: Record<string, string> = {
  gold: '--gold-500',
  sage: '--sage-400',
  teal: '--teal-500',
  neutral: '--ink-600',
};

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';
}

/** Donut interativo (Chart.js canvas) da divisão por status. */
export function OccupancyChart(props: {
  division: OccupancyDivision;
  t: MetricsPanelText;
}): JSX.Element {
  let canvas!: HTMLCanvasElement;
  let chart: Chart | undefined;

  onMount(() => {
    // jsdom (testes) não implementa canvas 2d — pula o gráfico.
    if (!canvas.getContext('2d')) return;
    const segs = segmentsOf(props.division, props.t);
    chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: segs.map((s) => s.label),
        datasets: [
          {
            data: segs.map((s) => s.count),
            backgroundColor: segs.map((s) => cssVar(TONE_VAR[s.tone])),
            borderColor: 'transparent',
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: '68%',
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        animation: { duration: 500 },
      },
    });
  });
  onCleanup(() => chart?.destroy());

  const segs = () => segmentsOf(props.division, props.t);

  return (
    <div class={styles.wrap}>
      <div class={styles.canvasBox}>
        <canvas ref={canvas} role="img" aria-label={props.t.occupancy} />
      </div>
      <dl class={styles.legend}>
        <For each={segs()}>
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
