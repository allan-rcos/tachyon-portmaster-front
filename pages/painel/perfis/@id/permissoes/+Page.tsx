import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { PageHeader } from '@/features/core/components/PageHeader';
import { FormSkeleton } from '@/features/core/components/Skeleton';
import { RoleForm } from '@/features/roles/islands/RoleForm.island';

export default function RolePermissionsPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[{ label: data.t.title, href: '/painel/perfis' }, { label: data.role.name }]}
      />
      <PageHeader title={data.role.name} subtitle={data.t.syncPermissions} />
      <ClientOnly fallback={<FormSkeleton rows={4} />}>
        <RoleForm
          mode="permissions"
          roleId={data.id}
          defaultName={data.role.name}
          defaultPermissions={data.role.permissions}
          t={data.t}
        />
      </ClientOnly>
    </section>
  );
}
