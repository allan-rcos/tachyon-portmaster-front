import type { OccupancyRowData } from '@viewmodel/metrics/dashboard-page.vm';
import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import styles from './OccupancyBreakdown.module.scss';

/** Props da divisão de ocupação. */
export interface OccupancyBreakdownProps {
  /** Linhas já formatadas pelo ViewModel. */
  rows: readonly OccupancyRowData[];
  /** Rótulo acessível do conjunto. */
  label: string;
}

/**
 * Divisão do pátio por status: uma LINHA por status (ponto + rótulo +
 * contagem + barra própria), como no protótipo. Antes era uma única barra
 * empilhada, e a repartição só se lia na legenda.
 *
 * @param props.rows  Linhas a desenhar.
 * @param props.label Rótulo acessível do conjunto.
 */
export function OccupancyBreakdown(props: OccupancyBreakdownProps): TemplateResult {
  return html`<ul class=${styles.rows} aria-label=${props.label}>
    ${props.rows.map(
      (row) =>
        html`<li class=${styles.row} data-tone=${row.tone}>
          <span class=${styles.head}>
            <span class=${styles.dot} aria-hidden="true"></span>
            <span class=${styles.label}>${row.label}</span>
            <span class=${styles.count}>${row.count}</span>
          </span>
          <span class=${styles.track}>
            <span class=${styles.fill} style=${styleMap({ width: `${row.share}%` })}></span>
          </span>
        </li>`,
    )}
  </ul>`;
}
