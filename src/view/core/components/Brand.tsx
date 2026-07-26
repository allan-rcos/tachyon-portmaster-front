import type { JSX } from 'solid-js';

import styles from './Brand.module.scss';

export interface BrandProps {
  compact?: boolean;
}

/** Lockup da marca: emblema "Volt" (circuito) + wordmark. O sufixo
 *  fica em ouro, evocando "powered on / connected". */
export function Brand(props: BrandProps): JSX.Element {
  return (
    <span class={styles.brand}>
      <svg class={styles.emblem} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <path
          d="M16 6v5M16 21v5M6 16h5M21 16h5M9 9l3.5 3.5M23 23l-3.5-3.5M23 9l-3.5 3.5M9 23l3.5-3.5"
          stroke="var(--gold-400)"
          stroke-width="1.6"
          stroke-linecap="round"
        />
        <rect x="12" y="12" width="8" height="8" rx="2" fill="var(--gold-500)" opacity="0.9" />
      </svg>
      {!props.compact && (
        <span class={styles.word}>
          Port<span class={styles.lit}>Master</span>
        </span>
      )}
    </span>
  );
}
