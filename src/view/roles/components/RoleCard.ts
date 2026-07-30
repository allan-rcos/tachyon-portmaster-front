import { Icon } from '@view/core/components/Icon';
import type { RoleRowData } from '@viewmodel/roles/role-list-page.vm';
import { html, type TemplateResult } from 'lit';

import styles from './RoleCard.module.scss';

export interface RoleCardProps {
  item: RoleRowData;
  /** Rótulo acessível do link de permissões. */
  editLabel: string;
  /** Rótulo do contador de permissões (ex.: "PERMISSÕES"). */
  permissionsLabel: string;
  /** Rótulo acessível do contador de usuários. */
  usersLabel: string;
}

/**
 * Cartão de perfil: identidade, quantos usuários o carregam e as permissões
 * concedidas como chips.
 *
 * As chips mostram o rótulo traduzido, não o código do enum — a View nunca vê
 * o enum, e "Ver produtos" diz mais a quem administra do que `ProductRead`.
 */
export function RoleCard(props: RoleCardProps): TemplateResult {
  const item = props.item;

  return html`<article class=${styles.card}>
    <header class=${styles.head}>
      <span class=${styles.icon} aria-hidden="true">${Icon({ name: 'shield', size: 20 })}</span>
      <div class=${styles.identity}>
        <h2 class=${styles.name}>${item.name}</h2>
      </div>
      <div class=${styles.actions}>
        <span class=${styles.users}>
          ${Icon({ name: 'users', size: 14 })}
          <span class="srOnly">${props.usersLabel}</span>
          ${item.userCount}
        </span>
        <a
          class=${styles.edit}
          href=${item.permissionsHref}
          aria-label=${`${props.editLabel} ${item.name}`}
        >
          ${Icon({ name: 'pencil', size: 15 })}
        </a>
      </div>
    </header>

    <span class=${styles.count}>${item.permissionCount} ${props.permissionsLabel}</span>
    <ul class=${styles.chips}>
      ${item.permissions.map((permission) => html`<li class=${styles.chip}>${permission}</li>`)}
    </ul>
  </article>`;
}
