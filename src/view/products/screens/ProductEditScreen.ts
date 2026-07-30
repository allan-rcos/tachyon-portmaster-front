import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductEditVM } from '@viewmodel/products/product-edit-page.vm';
import { html, type TemplateResult } from 'lit';

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
export function ProductEditScreen(props: ProductEditScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({
      items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.productName }],
    })}
    ${PageHeader({ title: `${vm.t.edit} — ${vm.productName}` })} ${ProductForm({ vm })}
  </section>`;
}
