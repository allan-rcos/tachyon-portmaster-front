import type { Renderable } from '@view/core/types';
import type { Tone } from '@viewmodel/core/i18n/labels';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './Badge.module.scss';

export interface BadgeProps {
  tone?: Tone;
  children: Renderable;
  dot?: boolean;
}

/** Selo de status com "tom" de marca. HTML puro. */
export function Badge(props: BadgeProps): TemplateResult {
  return html`<span class=${styles.badge} data-tone=${props.tone ?? 'neutral'}>
    ${props.dot ? html`<span class=${styles.dot} aria-hidden="true"></span>` : nothing}
    ${props.children}
  </span>`;
}
