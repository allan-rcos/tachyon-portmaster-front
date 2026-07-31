import { Badge } from '@view/core/components/Badge';
import { Card } from '@view/core/components/Card';
import type { AccountProfileVM } from '@viewmodel/account/vm-contracts';
import { For, type JSX } from 'solid-js';

import styles from './AccountProfile.module.scss';

/** Props do resumo do perfil autenticado. */
export interface AccountProfileProps {
  /** ViewModel da rota — só a fatia de leitura. */
  vm: AccountProfileVM;
}

/**
 * Resumo do perfil autenticado: identidade + perfis (SSR).
 *
 * A contagem de permissões já chega escrita e traduzida — antes o número era
 * formatado aqui e concatenado com a palavra "permissões" fixa em pt-BR.
 *
 * @param props.vm ViewModel da rota.
 */
export function AccountProfile(props: AccountProfileProps): JSX.Element {
  return (
    <Card title={props.vm.t.roles}>
      <dl class={styles.identity}>
        <div>
          <dt>{props.vm.t.name}</dt>
          <dd>{props.vm.identity.name}</dd>
        </div>
        <div>
          <dt>{props.vm.t.email}</dt>
          <dd class={styles.mono}>{props.vm.identity.email}</dd>
        </div>
      </dl>
      <ul class={styles.roles}>
        <For each={[...props.vm.roles]}>
          {(role) => (
            <li class={styles.role}>
              <Badge tone="teal">{role.name}</Badge>
              <span class={styles.perms}>{role.permissionsLabel}</span>
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
}
