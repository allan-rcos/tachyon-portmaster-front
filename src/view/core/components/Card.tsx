import type { JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import styles from './Card.module.scss';

export interface CardProps {
  children: JSX.Element;
  title?: string;
  actions?: JSX.Element;
  class?: string;
  as?: 'article' | 'section';
  /**
   * Nível do heading do título do card. Default `h2` para manter a hierarquia
   * (a página começa em `h1` no PageHeader) — evita pular de h1 direto para h3.
   */
  headingLevel?: 'h2' | 'h3' | 'h4';
}

/** Painel de vidro (glass L1). HTML puro. */
export function Card(props: CardProps): JSX.Element {
  return (
    <Dynamic
      component={props.as ?? 'article'}
      class={props.class ? `${styles.card} ${props.class}` : styles.card}
    >
      {(props.title || props.actions) && (
        <header class={styles.head}>
          {props.title && (
            <Dynamic component={props.headingLevel ?? 'h2'} class={styles.title}>
              {props.title}
            </Dynamic>
          )}
          {props.actions && <div class={styles.actions}>{props.actions}</div>}
        </header>
      )}
      {props.children}
    </Dynamic>
  );
}
