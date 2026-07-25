

import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

export default function NewRolePage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[{ label: data.t.title, href: '/painel/perfis' }, { label: data.t.new }]}
      />
      <PageHeader title={data.t.new} subtitle={data.t.subtitle} />
      <ClientOnly fallback={<FormSkeleton rows={4} />}>
        <RoleForm mode="create" t={data.t} />
      </ClientOnly>
    </section>
  );
}
