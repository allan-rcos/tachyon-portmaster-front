import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import styles from './Skeleton.module.scss';

export interface SkeletonProps {
  height?: string;
  width?: string;
}

/** Placeholder de carregamento (fallback de islands). */
export function Skeleton(props: SkeletonProps = {}): TemplateResult {
  return html`<span
    class=${styles.bar}
    style=${styleMap({ height: props.height ?? '1rem', width: props.width ?? '100%' })}
  ></span>`;
}

export interface FormSkeletonProps {
  rows?: number;
}

/** Esqueleto de formulário (usado no fallback do clientOnly). */
export function FormSkeleton(props: FormSkeletonProps = {}): TemplateResult {
  return html`<div class=${styles.form} aria-hidden="true">
    ${Array.from(
      { length: props.rows ?? 3 },
      () =>
        html`<div class=${styles.field}>
          ${Skeleton({ height: '0.85rem', width: '30%' })} ${Skeleton({ height: '2.6rem' })}
        </div>`,
    )}
  </div>`;
}
