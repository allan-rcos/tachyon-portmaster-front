import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { UserAdminActions } from '@view/users/islands/UserAdminActions.island';
import { UserForm } from '@view/users/islands/UserForm.island';
import type { UserEditVM } from '@viewmodel/users/user-edit-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela de edição de usuário, com as ações administrativas ao lado.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserEditScreen(props: { vm: UserEditVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.data, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<FormSkeleton rows={4} />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(edit) => (
        <section>
          <Breadcrumbs
            items={[
              { label: props.vm.t.title, href: '/painel/usuarios' },
              { label: edit.user.name },
            ]}
          />
          <PageHeader title={`${props.vm.t.edit} — ${edit.user.name}`} />
          <UserForm
            mode="edit"
            userId={props.vm.id}
            roles={edit.roles}
            defaultValues={{
              name: edit.user.name,
              email: edit.user.email,
              role_ids: edit.user.roles.map((role) => role.id),
            }}
            t={props.vm.t}
          />
          <UserAdminActions userId={props.vm.id} t={props.vm.t} />
        </section>
      )}
    </AsyncBoundary>
  );
}
