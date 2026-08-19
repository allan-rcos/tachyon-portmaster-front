import { RouteModal } from '@view/core/islands/RouteModal.island';
import { ProductList } from '@view/products/components/ProductList';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductCreateVM } from '@viewmodel/products/product-create-page.vm';
import type { ProductListVM } from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de cadastro de produto. */
export interface ProductCreateScreenProps {
  /** ViewModel do formulário. */
  vm: ProductCreateVM;
  /** ViewModel da listagem que fica atrás do modal. */
  list: ProductListVM;
}

/**
 * Cadastro de produto — modal sobre o catálogo, como no protótipo.
 *
 * A rota continua existindo e continua sendo renderizada no servidor: o que
 * mudou foi a apresentação. Quem chega por `/painel/produtos/nova` (link, F5 ou
 * URL colada) recebe o catálogo com o modal já aberto, e fechar é navegar de
 * volta para a listagem — daí o `closeHref` em vez de um `onClose`.
 *
 * Saíram o `Breadcrumbs` e o `PageHeader`: dentro do modal quem situa é o
 * cabeçalho dele (sobrescrita + título), e a trilha ficaria repetindo a
 * listagem que está visível logo atrás.
 *
 * @param props.vm   ViewModel do formulário.
 * @param props.list ViewModel da listagem de fundo.
 */
export function ProductCreateScreen(props: ProductCreateScreenProps): JSX.Element {
  return (
    <>
      <ProductList vm={props.list} />
      <RouteModal
        eyebrow={props.list.t.eyebrow}
        title={props.vm.t.new}
        icon="package"
        tint="sage"
        closeHref={props.vm.listHref}
        closeLabel={props.vm.t.close}
      >
        <ProductForm vm={props.vm} />
      </RouteModal>
    </>
  );
}
