import { For, type JSX } from 'solid-js';
import type { AccountProfile as Profile } from 'tachyon-portmaster-sdk/account';

import styles from './AccountProfile.module.scss';

import { Badge } from '@/features/core/components/Badge';
import { Card } from '@/features/core/components/Card';
import { formatNumber } from '@/features/core/utils/formatters';

/** Texto que este resumo consome (contrato local). */
export interface AccountProfileText {
  roles: string;
  name: string;
  email: string;
}

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
