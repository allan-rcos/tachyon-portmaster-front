import type { Renderable } from '@view/core/types';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './EmptyState.module.scss';
import { Icon, type IconName } from './Icon';

export interface EmptyStateProps {
  icon?: IconName;
  message: string;
  action?: Renderable;
}

/** Estado vazio de listagens. */
export function EmptyState(props: EmptyStateProps): TemplateResult {
  return html`<div class=${styles.empty}>
    ${props.icon ? Icon({ name: props.icon, size: 32 }) : nothing}
    <p class=${styles.message}>${props.message}</p>
    ${props.action}
  </div>`;
}
