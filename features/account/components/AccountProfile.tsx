import { For, type JSX } from 'solid-js';

import styles from './AccountProfile.module.scss';

import type { AccountProfile as Profile } from '@/services/gen/flow/v1/account';
import { Badge } from '@/shared/components/Badge';
import { Card } from '@/shared/components/Card';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { formatNumber } from '@/shared/utils/formatters';

/** Resumo do perfil autenticado: identidade + perfis/permissões (SSR). */
export function AccountProfile(props: { profile: Profile; t: Messages }): JSX.Element {
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
