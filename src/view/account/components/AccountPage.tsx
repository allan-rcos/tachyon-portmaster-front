import { AccountProfile } from '@view/account/components/AccountProfile';
import { AccountForm } from '@view/account/islands/AccountForm.island';
import { PasswordChange } from '@view/account/islands/PasswordChange.island';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { Card } from '@view/core/components/Card';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import type { AccountProfile as Profile } from '@viewmodel/account/domain';
import type { AccountPageText } from '@viewmodel/account/i18n/account-page.messages';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

import styles from '../styles/AccountPage.module.scss';

/**
 * Tela da conta própria: resumo SSR + formulários hidratados no cliente.
 *
 * @param props.profile Perfil do usuário autenticado.
 * @param props.t       Texto já resolvido para o locale da requisição.
 */
export function AccountPage(props: { profile: Profile; t: AccountPageText }): JSX.Element {
  return (
    <section>
      <Breadcrumbs items={[{ label: props.t.title }]} />
      <PageHeader title={props.t.title} subtitle={props.t.subtitle} />
      <div class={styles.grid}>
        <AccountProfile profile={props.profile} t={props.t} />
        <Card title={props.t.profile}>
          <ClientOnly fallback={<FormSkeleton rows={2} />}>
            <AccountForm name={props.profile.name} email={props.profile.email} t={props.t} />
          </ClientOnly>
        </Card>
        <Card title={props.t.security}>
          <ClientOnly fallback={<FormSkeleton rows={2} />}>
            <PasswordChange t={props.t} />
          </ClientOnly>
        </Card>
      </div>
    </section>
  );
}
