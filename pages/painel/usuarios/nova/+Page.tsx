import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { PageHeader } from '@/features/core/components/PageHeader';
import { FormSkeleton } from '@/features/core/components/Skeleton';
import { UserForm } from '@/features/users/islands/UserForm.island';

export default function NewUserPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[{ label: data.t.title, href: '/painel/usuarios' }, { label: data.t.new }]}
      />
      <PageHeader title={data.t.new} />
      <ClientOnly fallback={<FormSkeleton rows={4} />}>
        <UserForm mode="create" roles={data.roles} t={data.t} />
      </ClientOnly>
    </section>
  );
}
