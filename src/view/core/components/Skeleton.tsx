import { For, type JSX } from 'solid-js';

import styles from './Skeleton.module.scss';

export interface SkeletonProps {
  height?: string;
  width?: string;
}

/** Placeholder de carregamento (fallback de islands). */
export function Skeleton(props: SkeletonProps): JSX.Element {
  return (
    <span
      class={styles.bar}
      style={{ height: props.height ?? '1rem', width: props.width ?? '100%' }}
    />
  );
}

export interface FormSkeletonProps {
  rows?: number;
}

/** Esqueleto de formulário (usado no fallback do ClientOnly). */
export function FormSkeleton(props: FormSkeletonProps): JSX.Element {
  return (
    <div class={styles.form} aria-hidden="true">
      <For each={Array.from({ length: props.rows ?? 3 })}>
        {() => (
          <div class={styles.field}>
            <Skeleton height="0.85rem" width="30%" />
            <Skeleton height="2.6rem" />
          </div>
        )}
      </For>
    </div>
  );
}
