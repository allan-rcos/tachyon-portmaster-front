import type { Tone } from '@viewmodel/core/i18n/labels';
import type { JSX } from 'solid-js';

import styles from './Badge.module.scss';


export interface BadgeProps {
  tone?: Tone;
  children: JSX.Element;
  dot?: boolean;
}

/** Selo de status com "tom" de marca. HTML puro. */
export function Badge(props: BadgeProps): JSX.Element {
  return (
    <span class={styles.badge} data-tone={props.tone ?? 'neutral'}>
      {props.dot && <span class={styles.dot} aria-hidden="true" />}
      {props.children}
    </span>
  );
}
