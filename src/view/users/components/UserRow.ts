import { Badge } from '@view/core/components/Badge';
import { Icon } from '@view/core/components/Icon';
import type { UserRowData } from '@viewmodel/users/user-list-page.vm';
import { html, type TemplateResult } from 'lit';

import styles from './UserRow.module.scss';

export interface UserRowProps {
  item: UserRowData;
  /** Rótulo acessível do link de edição. */
  editLabel: string;
}

/**
 * Células de uma linha de usuário, na ordem das colunas do `RowList`:
 * nome · e-mail · perfis · ação.
 */
export function UserRow(props: UserRowProps): TemplateResult {
  return html`<a class=${styles.name} href=${props.item.editHref}>${props.item.name}</a>
    <span class=${styles.email}>${props.item.email}</span>
    <span class=${styles.roles}>
      ${props.item.roles.map((role) => Badge({ children: role }))}
    </span>
    <span class=${styles.action}>
      <a
        class=${styles.edit}
        href=${props.item.editHref}
        aria-label=${`${props.editLabel} ${props.item.name}`}
      >
        ${Icon({ name: 'pencil', size: 15 })}
      </a>
    </span>`;
}
