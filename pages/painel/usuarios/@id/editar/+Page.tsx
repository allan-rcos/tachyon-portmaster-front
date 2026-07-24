import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { PageHeader } from '@/features/core/components/PageHeader';
import { FormSkeleton } from '@/features/core/components/Skeleton';
import { UserAdminActions } from '@/features/users/islands/UserAdminActions.island';
import { UserForm } from '@/features/users/islands/UserForm.island';

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
