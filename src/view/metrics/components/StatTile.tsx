import { Badge } from '@view/core/components/Badge';
import { Icon, type IconName } from '@view/core/components/Icon';
import type { Tone } from '@viewmodel/core/i18n/labels';
import { Show, type JSX } from 'solid-js';

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
export function StatTile(props: StatTileProps): JSX.Element {
  return (
    <article class={styles.tile} data-tone={props.tone}>
      <div class={styles.head}>
        <span class={styles.icon}>
          <Icon name={props.icon} size={18} />
        </span>
        <Show when={props.badge}>{(text) => <Badge tone={props.tone}>{text()}</Badge>}</Show>
      </div>
      <p class={styles.value}>
        {props.value}
        <Show when={props.unit}>{(unit) => <span class={styles.unit}>{unit()}</span>}</Show>
      </p>
      <p class={styles.label}>{props.label}</p>
    </article>
  );
}
