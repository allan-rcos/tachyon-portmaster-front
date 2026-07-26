import { Icon } from '@view/core/components/Icon';
import type { RoleRowData } from '@viewmodel/roles/role-list-page.vm';
import { For, type JSX } from 'solid-js';

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
export function RoleCard(props: RoleCardProps): JSX.Element {
  return (
    <article class={styles.card}>
      <header class={styles.head}>
        <span class={styles.icon} aria-hidden="true">
          <Icon name="shield" size={20} />
        </span>
        <div class={styles.identity}>
          <h2 class={styles.name}>{props.item.name}</h2>
        </div>
        <div class={styles.actions}>
          <span class={styles.users}>
            <Icon name="users" size={14} />
            <span class="srOnly">{props.usersLabel}</span>
            {props.item.userCount}
          </span>
          <a
            class={styles.edit}
            href={props.item.permissionsHref}
            aria-label={`${props.editLabel} ${props.item.name}`}
          >
            <Icon name="pencil" size={15} />
          </a>
        </div>
      </header>

      <span class={styles.count}>
        {props.item.permissionCount} {props.permissionsLabel}
      </span>
      <ul class={styles.chips}>
        <For each={props.item.permissions}>
          {(permission) => <li class={styles.chip}>{permission}</li>}
        </For>
      </ul>
    </article>
  );
}
