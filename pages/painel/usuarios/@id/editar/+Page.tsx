

import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { UserAdminActions } from '@view/users/islands/UserAdminActions.island';
import { UserForm } from '@view/users/islands/UserForm.island';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

export default function EditUserPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[{ label: data.t.title, href: '/painel/usuarios' }, { label: data.user.name }]}
      />
      <PageHeader title={`${data.t.edit} — ${data.user.name}`} />
      <ClientOnly fallback={<FormSkeleton rows={4} />}>
        <UserForm
          mode="edit"
          userId={data.id}
          roles={data.roles}
          defaultValues={{
            name: data.user.name,
            email: data.user.email,
            role_ids: data.user.roles.map((r) => r.id),
          }}
          t={data.t}
        />
      </ClientOnly>
      <ClientOnly fallback={<span />}>
        <UserAdminActions userId={data.id} t={data.t} />
      </ClientOnly>
    </section>
  );
}
