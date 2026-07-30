import { AccountProfile } from '@view/account/components/AccountProfile';
import { AccountForm } from '@view/account/islands/AccountForm.island';
import { PasswordChange } from '@view/account/islands/PasswordChange.island';
import styles from '@view/account/styles/AccountPage.module.scss';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { Card } from '@view/core/components/Card';
import { PageHeader } from '@view/core/components/PageHeader';
import type { AccountPageVM } from '@viewmodel/account/account-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela da conta própria. */
export interface AccountPageProps {
  /** ViewModel da rota. */
  vm: AccountPageVM;
}

/**
 * Tela da conta própria: resumo + formulários. Stateless.
 *
 * Os `ClientOnly` em volta dos formulários saíram: o conteúdo vem do servidor e
 * as islands hidratam por cima, sem esqueleto piscando.
 *
 * Os dois formulários leem o MESMO `vm`, cada um o subconjunto que declarou —
 * antes recebiam `name`/`email`/`t` por prop e guardavam estado cada um.
 *
 * @param props.vm ViewModel da rota.
 */
export function AccountPage(props: AccountPageProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title }] })}
    ${PageHeader({ title: vm.t.title, subtitle: vm.t.subtitle })}
    <div class=${styles.grid}>
      ${AccountProfile({ vm })} ${Card({ title: vm.t.profile, children: AccountForm({ vm }) })}
      ${Card({ title: vm.t.security, children: PasswordChange({ vm }) })}
    </div>
  </section>`;
}
