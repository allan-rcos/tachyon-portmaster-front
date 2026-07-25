import { AccountPage } from '@view/account/components/AccountPage';
import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import type { AccountPageVM } from '@viewmodel/account/account-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela do perfil próprio.
 *
 * @param props.vm ViewModel da rota.
 */
export function AccountScreen(props: { vm: AccountPageVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.profile, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<Skeleton height="24rem" />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(profile) => <AccountPage profile={profile} t={props.vm.t} />}
    </AsyncBoundary>
  );
}
