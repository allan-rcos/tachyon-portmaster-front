import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { ContainerForm } from '@/features/containers/islands/ContainerForm.island';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { PageHeader } from '@/shared/components/PageHeader';
import { FormSkeleton } from '@/shared/components/Skeleton';

export default function NewContainerPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[{ label: data.t.title, href: '/painel/conteineres' }, { label: data.t.new }]}
      />
      <PageHeader title={data.t.new} />
      <ClientOnly fallback={<FormSkeleton rows={2} />}>
        <ContainerForm mode="create" t={data.t} />
      </ClientOnly>
    </section>
  );
}
