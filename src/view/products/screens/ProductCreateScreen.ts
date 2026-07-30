import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductCreateVM } from '@viewmodel/products/product-create-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela de cadastro de produto. */
export interface ProductCreateScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ProductCreateVM;
}

/**
 * Tela de cadastro de produto. Stateless: só o formulário.
 *
 * O `ClientOnly` em volta do formulário saiu: ele existia para esconder que a
 * tela inteira só renderizava no navegador. Agora o chrome vem do servidor e o
 * formulário hidrata em cima — sem esqueleto piscando.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductCreateScreen(props: ProductCreateScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.t.new }] })}
    ${PageHeader({ title: vm.t.new })} ${ProductForm({ vm })}
  </section>`;
}
