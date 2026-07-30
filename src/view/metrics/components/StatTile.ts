import { Badge } from '@view/core/components/Badge';
import { Icon, type IconName } from '@view/core/components/Icon';
import type { Tone } from '@viewmodel/core/i18n/labels';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './StatTile.module.scss';

export interface StatTileProps {
  icon: IconName;
  /** Tom de marca do quadrado do ícone e do selo. */
  tone: Tone;
  /** Número já formatado no locale (ex.: `'124,3'`). */
  value: string;
  /** Unidade ou total que acompanha o número (ex.: `'t'`, `'/10'`). */
  unit?: string;
  label: string;
  /** Selo opcional à direita do ícone (ex.: "em rota"). */
  badge?: string;
}

/** Bloco de número do painel: ícone tingido, valor grande, rótulo. */
export function StatTile(props: StatTileProps): TemplateResult {
  return html`<article class=${styles.tile} data-tone=${props.tone}>
    <div class=${styles.head}>
      <span class=${styles.icon}>${Icon({ name: props.icon, size: 18 })}</span>
      ${props.badge ? Badge({ tone: props.tone, children: props.badge }) : nothing}
    </div>
    <p class=${styles.value}>
      ${props.value}${props.unit ? html`<span class=${styles.unit}>${props.unit}</span>` : nothing}
    </p>
    <p class=${styles.label}>${props.label}</p>
  </article>`;
}
