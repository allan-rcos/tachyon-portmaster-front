

import { Badge } from '@view/core/components/Badge';
import { Card } from '@view/core/components/Card';
import type { AccountProfile as Profile } from '@viewmodel/account/domain';
import type { AccountProfileText } from '@viewmodel/account/i18n/text-contracts';
import { formatNumber } from '@viewmodel/core/utils/formatters';
import { For, type JSX } from 'solid-js';

import styles from './AccountProfile.module.scss';

/** Resumo do perfil autenticado: identidade + perfis/permissões (SSR). */
export function AccountProfile(props: { profile: Profile; t: AccountProfileText }): JSX.Element {
  return (
    <Card title={props.t.roles}>
      <dl class={styles.identity}>
        <div>
          <dt>{props.t.name}</dt>
          <dd>{props.profile.name}</dd>
        </div>
        <div>
          <dt>{props.t.email}</dt>
          <dd class={styles.mono}>{props.profile.email}</dd>
        </div>
      </dl>
      <ul class={styles.roles}>
        <For each={props.profile.roles}>
          {(role) => (
            <li class={styles.role}>
              <Badge tone="teal">{role.name}</Badge>
              <span class={styles.perms}>{formatNumber(role.permissions.length)} permissões</span>
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
}

export type { AccountProfileText };
