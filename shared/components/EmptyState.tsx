import type { JSX } from 'solid-js';

import styles from './EmptyState.module.scss';
import { Icon, type IconName } from './Icon';

export interface EmptyStateProps {
  icon?: IconName;
  message: string;
  action?: JSX.Element;
}

/** Estado vazio de listagens. */
export function EmptyState(props: EmptyStateProps): JSX.Element {
  return (
    <div class={styles.empty}>
      {props.icon && <Icon name={props.icon} size={32} />}
      <p class={styles.message}>{props.message}</p>
      {props.action}
    </div>
  );
}
