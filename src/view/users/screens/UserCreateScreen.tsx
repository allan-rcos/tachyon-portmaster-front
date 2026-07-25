import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserCreateVM } from '@viewmodel/users/user-create-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela de criação de usuário. Depende dos perfis disponíveis, então carrega.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserCreateScreen(props: { vm: UserCreateVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.roles, props.vm.load);

  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: '/painel/usuarios' }, { label: props.vm.t.new }]}
      />
      <PageHeader title={props.vm.t.new} />
      <AsyncBoundary
        status={status()}
        data={data()}
        fallback={<FormSkeleton rows={4} />}
        errorMessage={props.vm.boundary.loadError}
        retryLabel={props.vm.boundary.retry}
        onRetry={() => void props.vm.load()}
      >
        {(roles) => <UserForm mode="create" roles={roles} t={props.vm.t} />}
      </AsyncBoundary>
    </section>
  );
}
