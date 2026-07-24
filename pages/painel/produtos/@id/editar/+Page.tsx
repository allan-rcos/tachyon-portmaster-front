import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { PageHeader } from '@/features/core/components/PageHeader';
import { FormSkeleton } from '@/features/core/components/Skeleton';
import { ProductForm } from '@/features/products/islands/ProductForm.island';

export default function EditProductPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs
        items={[{ label: data.t.title, href: '/painel/produtos' }, { label: data.product.name }]}
      />
      <PageHeader title={`${data.t.edit} — ${data.product.name}`} />
      <ClientOnly fallback={<FormSkeleton rows={3} />}>
        <ProductForm
          mode="edit"
          productId={data.id}
          defaultValues={{
            name: data.product.name,
            density: data.product.density,
            risk_class: data.product.risk_class,
          }}
          t={data.t}
        />
      </ClientOnly>
    </section>
  );
}
