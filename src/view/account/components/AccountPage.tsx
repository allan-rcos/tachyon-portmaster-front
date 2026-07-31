import { AccountProfile } from '@view/account/components/AccountProfile';
import { AccountForm } from '@view/account/islands/AccountForm.island';
import { PasswordChange } from '@view/account/islands/PasswordChange.island';
import styles from '@view/account/styles/AccountPage.module.scss';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { Card } from '@view/core/components/Card';
import { PageHeader } from '@view/core/components/PageHeader';
import type { AccountPageVM } from '@viewmodel/account/account-page.vm';
import type { JSX } from 'solid-js';

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
 * @param props.vm ViewModel da rota.
 */
export function AccountPage(props: AccountPageProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs items={[{ label: props.vm.t.title }]} />
      <PageHeader title={props.vm.t.title} subtitle={props.vm.t.subtitle} />
      <div class={styles.grid}>
        <AccountProfile vm={props.vm} />
        <Card title={props.vm.t.profile}>
          <AccountForm vm={props.vm} />
        </Card>
        <Card title={props.vm.t.security}>
          <PasswordChange vm={props.vm} />
        </Card>
      </div>
    </section>
  );
}
