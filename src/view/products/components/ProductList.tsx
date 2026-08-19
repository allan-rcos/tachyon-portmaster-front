import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { RowList } from '@view/core/components/RowList';
import { Toolbar } from '@view/core/components/Toolbar';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import { toAccessor } from '@view/core/observable/to-accessor';
import { ProductRow } from '@view/products/components/ProductRow';
import type { ProductListVM } from '@viewmodel/products/product-list-page.vm';
import { Show, type JSX } from 'solid-js';

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
 * @param props.vm ViewModel da rota.
 */
export function ProductList(props: ProductListProps): JSX.Element {
  // A leitura passa por um thunk (`() => props.vm.x()`) em vez de entregar o
  // getter direto: assim a ponte continua correta mesmo se o `vm` da prop
  // trocar, e o `solid/reactivity` para de reclamar com razão.
  const items = toAccessor(() => props.vm.items());
  const isLoadingMore = toAccessor(() => props.vm.isLoadingMore());
  const errorMessage = toAccessor(() => props.vm.errorMessage());
  const hasMore = toAccessor(() => props.vm.hasMore());

  return (
    <section>
      <Toolbar
        eyebrow={props.vm.t.eyebrow}
        title={props.vm.t.title}
        subtitle={props.vm.t.subtitle}
        search={{
          name: 'search',
          value: props.vm.search,
          label: props.vm.t.search,
          placeholder: `${props.vm.t.search} ${props.vm.t.name.toLowerCase()}`,
        }}
        action={
          <Show when={props.vm.canCreate}>
            <a class={styles.newBtn} href={props.vm.newHref}>
              <Icon name="plus" size={16} />
              {props.vm.t.new}
            </a>
          </Show>
        }
      />

      <Show
        when={items().length > 0}
        fallback={<EmptyState icon="flask" message={props.vm.t.empty} />}
      >
        <RowList
          columns="54px 1fr 150px 230px 52px"
          mobile={{ columns: '1fr auto', areas: "'name action' 'risk risk' 'meta meta'" }}
          headers={[props.vm.t.id, props.vm.t.name, props.vm.t.density, props.vm.t.riskClass, '']}
          items={items()}
        >
          {(item) => <ProductRow item={item} editLabel={props.vm.t.edit} />}
        </RowList>
      </Show>

      <InfiniteList
        hasMore={hasMore()}
        isLoading={isLoadingMore()}
        error={errorMessage()}
        loadMore={props.vm.loadMore}
        retry={props.vm.retry}
        loadMoreLabel={props.vm.t.loadMore}
        retryLabel={props.vm.boundary.retry}
      />
    </section>
  );
}
