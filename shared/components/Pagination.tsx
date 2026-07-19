import type { JSX } from 'solid-js';

import { Icon } from './Icon';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  prevHref?: string;
  nextHref?: string;
  total?: number;
  shown?: number;
  labels: { previous: string; next: string };
}

/** Paginação por cursor via links `<a>` (SSR). */
export function Pagination(props: PaginationProps): JSX.Element {
  return (
    <nav class={styles.nav} aria-label="Paginação">
      <a
        class={styles.link}
        href={props.prevHref}
        aria-disabled={!props.prevHref}
        tabindex={props.prevHref ? undefined : -1}
      >
        <Icon name="arrowLeft" size={16} />
        {props.labels.previous}
      </a>
      {props.total !== undefined && (
        <span class={styles.count}>
          {props.shown ?? 0} / {props.total}
        </span>
      )}
      <a
        class={styles.link}
        href={props.nextHref}
        aria-disabled={!props.nextHref}
        tabindex={props.nextHref ? undefined : -1}
      >
        {props.labels.next}
        <Icon name="chevronRight" size={16} />
      </a>
    </nav>
  );
}
