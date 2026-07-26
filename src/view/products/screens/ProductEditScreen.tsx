import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductEditVM } from '@viewmodel/products/product-edit-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de edição de produto. */
export interface ProductEditScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ProductEditVM;
}

/**
 * Tela de edição de produto. Stateless.
 *
 * Sem `AsyncBoundary`: o produto já veio resolvido pelo `+data`, então quando
 * esta tela renderiza não há carga pendente nem erro a tratar — o id que não
 * resolve virou 404 antes de chegar aqui.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductEditScreen(props: ProductEditScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: props.vm.t.title, href: props.vm.listHref },
          { label: props.vm.productName },
        ]}
      />
      <PageHeader title={`${props.vm.t.edit} — ${props.vm.productName}`} />
      <ProductForm
        mode="edit"
        productId={props.vm.id}
        defaultValues={props.vm.values}
        t={props.vm.t}
        riskOptions={props.vm.riskOptions}
      />
    </section>
  );
}
