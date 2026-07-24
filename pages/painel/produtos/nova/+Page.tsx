import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { PageHeader } from '@/features/core/components/PageHeader';
import { FormSkeleton } from '@/features/core/components/Skeleton';
import { ProductForm } from '@/features/products/islands/ProductForm.island';

export default function NewProductPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[{ label: data.t.title, href: '/painel/produtos' }, { label: data.t.new }]}
      />
      <PageHeader title={data.t.new} />
      <ClientOnly fallback={<FormSkeleton rows={3} />}>
        <ProductForm mode="create" t={data.t} />
      </ClientOnly>
    </section>
  );
}
