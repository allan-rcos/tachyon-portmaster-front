import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductCreateVM } from '@viewmodel/products/product-create-page.vm';
import type { JSX } from 'solid-js';

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
export function ProductCreateScreen(props: ProductCreateScreenProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: props.vm.listHref }, { label: props.vm.t.new }]}
      />
      <PageHeader title={props.vm.t.new} />
      <ProductForm vm={props.vm} />
    </section>
  );
}
