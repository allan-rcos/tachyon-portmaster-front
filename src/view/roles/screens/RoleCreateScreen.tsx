import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import type { RoleCreateVM } from '@viewmodel/roles/role-create-page.vm';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

/**
 * Tela de criação de perfil, com a matriz de permissões.
 *
 * @param props.vm ViewModel da rota.
 */
export function RoleCreateScreen(props: { vm: RoleCreateVM }): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: '/painel/perfis' }, { label: props.vm.t.new }]}
      />
      <PageHeader title={props.vm.t.new} subtitle={props.vm.t.subtitle} />
      <ClientOnly fallback={<FormSkeleton rows={4} />}>
        <RoleForm mode="create" t={props.vm.t} />
      </ClientOnly>
    </section>
  );
}
