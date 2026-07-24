import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { ContainerForm } from '@/features/containers/islands/ContainerForm.island';
import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { PageHeader } from '@/features/core/components/PageHeader';
import { FormSkeleton } from '@/features/core/components/Skeleton';

export default function EditContainerPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: data.t.title, href: '/painel/conteineres' },
          { label: data.container.code, href: `/painel/conteineres/${data.id}` },
          { label: data.t.edit },
        ]}
      />
      <PageHeader title={`${data.t.edit} — ${data.container.code}`} />
      <ClientOnly fallback={<FormSkeleton rows={1} />}>
        <ContainerForm
          mode="edit"
          containerId={data.id}
          defaultValues={{ code: data.container.code, max_capacity: data.container.max_capacity }}
          t={data.t}
        />
      </ClientOnly>
    </section>
  );
}
