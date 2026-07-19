import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { UserForm } from '@/features/users/islands/UserForm.island';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { PageHeader } from '@/shared/components/PageHeader';
import { FormSkeleton } from '@/shared/components/Skeleton';

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
