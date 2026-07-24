import type { JSX } from 'solid-js';

import styles from './PageHeader.module.scss';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: JSX.Element;
}

/** Cabeçalho de página: título + subtítulo + ação primária. */
export function PageHeader(props: PageHeaderProps): JSX.Element {
  return (
    <header class={styles.bar}>
      <div class={styles.text}>
        <h1 class={styles.title}>{props.title}</h1>
        {props.subtitle && <p class={styles.subtitle}>{props.subtitle}</p>}
      </div>
      {props.action && <div class={styles.action}>{props.action}</div>}
    </header>
  );
}
