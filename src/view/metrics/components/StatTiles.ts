import type { StatTileData } from '@viewmodel/metrics/dashboard-page.vm';
import { html, type TemplateResult } from 'lit';

import { StatTile } from './StatTile';
import styles from './StatTiles.module.scss';

/** Props dos cartões de KPI. */
export interface StatTilesProps {
  /** Cartões já formatados pelo ViewModel. */
  tiles: readonly StatTileData[];
}

/**
 * Grade dos cartões de KPI do painel (SSR). Valores já chegam formatados.
 *
 * @param props.tiles Cartões a desenhar.
 */
export function StatTiles(props: StatTilesProps): TemplateResult {
  return html`<ul class=${styles.grid}>
    ${props.tiles.map(
      (tile) =>
        html`<li>
          ${StatTile({
            icon: tile.icon,
            tone: tile.tone,
            value: tile.value,
            unit: tile.unit,
            label: tile.label,
          })}
        </li>`,
    )}
  </ul>`;
}
