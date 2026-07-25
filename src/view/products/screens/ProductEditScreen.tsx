import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductEditVM } from '@viewmodel/products/product-edit-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela de edição de produto.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductEditScreen(props: { vm: ProductEditVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.product, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<FormSkeleton rows={3} />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(product) => (
        <section>
          <Breadcrumbs
            items={[{ label: props.vm.t.title, href: '/painel/produtos' }, { label: product.name }]}
          />
          <PageHeader title={`${props.vm.t.edit} — ${product.name}`} />
          <ProductForm
            mode="edit"
            productId={props.vm.id}
            defaultValues={{
              name: product.name,
              density: product.density,
              risk_class: product.risk_class,
            }}
            t={props.vm.t}
          />
        </section>
      )}
    </AsyncBoundary>
  );
}
