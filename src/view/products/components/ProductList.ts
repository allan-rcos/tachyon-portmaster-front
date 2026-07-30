import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { RowList } from '@view/core/components/RowList';
import { Toolbar } from '@view/core/components/Toolbar';
import { island } from '@view/core/island/mount';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import { ProductRow } from '@view/products/components/ProductRow';
import type { ProductListVM, ProductRowData } from '@viewmodel/products/product-list-page.vm';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './ProductList.module.scss';

/** Props da listagem de produtos. */
export interface ProductListProps {
  /** ViewModel da rota. */
  vm: ProductListVM;
}

/**
 * Listagem de produtos — o padrão `RowList` do protótipo.
 *
 * As medidas da grade (`54px 1fr 150px 230px 52px`, padding `15px 22px`) vêm
 * medidas do protótipo e ficam aqui, no dono da tela, porque não se generalizam
 * para as outras listas. No mobile a linha se reorganiza em três faixas —
 * nome+ação, risco, densidade — em vez de encolher as cinco colunas.
 *
 * Os getters do ViewModel são LIDOS DIRETO: `vm.items()`, `vm.hasMore()`. O
 * `toAccessor` que antes traduzia alien-signals para o sistema do Solid não
 * existe mais — o effect raiz reavalia este template e é isso que registra a
 * dependência.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductList(props: ProductListProps): TemplateResult {
  const { vm } = props;
  const items = vm.items();

  return html`<section>
    ${Toolbar({
      eyebrow: vm.t.eyebrow,
      title: vm.t.title,
      subtitle: vm.t.subtitle,
      action: vm.canCreate
        ? html`<a class=${styles.newBtn} href=${vm.newHref}>
            ${Icon({ name: 'plus', size: 16 })} ${vm.t.new}
          </a>`
        : nothing,
    })}
    ${
      items.length > 0
        ? RowList<ProductRowData>({
            columns: '54px 1fr 150px 230px 52px',
            mobile: { columns: '1fr auto', areas: "'name action' 'risk risk' 'meta meta'" },
            headers: [vm.t.id, vm.t.name, vm.t.density, vm.t.riskClass, ''],
            items,
            children: (item) => ProductRow({ item, editLabel: vm.t.edit }),
          })
        : EmptyState({ icon: 'flask', message: vm.t.empty })
    }
    ${island(InfiniteList, {
      hasMore: vm.hasMore(),
      isLoading: vm.isLoadingMore(),
      error: vm.errorMessage(),
      loadMore: vm.loadMore,
      retry: vm.retry,
      loadMoreLabel: vm.t.loadMore,
      retryLabel: vm.boundary.retry,
    })}
  </section>`;
}
