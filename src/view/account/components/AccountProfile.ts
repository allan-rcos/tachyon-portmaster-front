import { Badge } from '@view/core/components/Badge';
import { Card } from '@view/core/components/Card';
import type { AccountIdentity, AccountRoleData } from '@viewmodel/account/account-page.vm';
import type { AccountProfileText } from '@viewmodel/account/i18n/text-contracts';
import { html, type TemplateResult } from 'lit';

import styles from './AccountProfile.module.scss';

/**
 * O que o resumo precisa do ViewModel da rota — só leitura, nada do estado dos
 * formulários que dividem a tela com ele.
 *
 * Ver `@view/products/islands/ProductForm.island` para por que o tipo mora na
 * View e não é importado pelo VM.
 */
export interface AccountProfileVM {
  t: AccountProfileText;
  identity: AccountIdentity;
  roles: readonly AccountRoleData[];
}

/** Props do resumo do perfil autenticado. */
export interface AccountProfileProps {
  /** ViewModel da rota. */
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
export function AccountProfile(props: AccountProfileProps): TemplateResult {
  const { vm } = props;

  return Card({
    title: vm.t.roles,
    children: html`<dl class=${styles.identity}>
        <div>
          <dt>${vm.t.name}</dt>
          <dd>${vm.identity.name}</dd>
        </div>
        <div>
          <dt>${vm.t.email}</dt>
          <dd class=${styles.mono}>${vm.identity.email}</dd>
        </div>
      </dl>
      <ul class=${styles.roles}>
        ${vm.roles.map(
          (role) =>
            html`<li class=${styles.role}>
              ${Badge({ tone: 'teal', children: role.name })}
              <span class=${styles.perms}>${role.permissionsLabel}</span>
            </li>`,
        )}
      </ul>`,
  });
}
