import { RouteModal } from '@view/core/islands/RouteModal.island';
import { ProductList } from '@view/products/components/ProductList';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductEditVM } from '@viewmodel/products/product-edit-page.vm';
import type { ProductListVM } from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de edição de produto. */
export interface ProductEditScreenProps {
  /** ViewModel do formulário. */
  vm: ProductEditVM;
  /** ViewModel da listagem que fica atrás do modal. */
  list: ProductListVM;
}

/**
 * Edição de produto — modal sobre o catálogo. Ver `./ProductCreateScreen`.
 *
 * O título leva o nome do produto porque, diferente do cadastro, o modal de
 * edição precisa dizer O QUE está editando: a linha correspondente fica
 * coberta por ele.
 *
 * @param props.vm   ViewModel do formulário.
 * @param props.list ViewModel da listagem de fundo.
 */
export function ProductEditScreen(props: ProductEditScreenProps): JSX.Element {
  return (
    <>
      <ProductList vm={props.list} />
      <RouteModal
        eyebrow={props.list.t.eyebrow}
        title={props.vm.productName}
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
