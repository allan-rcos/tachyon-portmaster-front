import { ContainerCard } from '@view/containers/components/ContainerCard';
import { CardList } from '@view/core/components/CardList';
import { EmptyState } from '@view/core/components/EmptyState';
import { FilterTabs } from '@view/core/components/FilterTabs';
import { Icon } from '@view/core/components/Icon';
import { Toolbar } from '@view/core/components/Toolbar';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { ContainerListVM } from '@viewmodel/containers/container-list-page.vm';
import { Show, type JSX } from 'solid-js';

import styles from './ContainerList.module.scss';

/** Props da listagem de contêineres. */
export interface ContainerListProps {
  /** ViewModel da rota. */
  vm: ContainerListVM;
}

/**
 * Listagem de contêineres — o padrão `CardList` do protótipo.
 *
 * Contêiner é a única entidade cujo estado é visual (quanto está cheio), e é
 * por isso que aqui a lista é de cartões e não de linhas: o cartão tem espaço
 * para a silhueta preenchida e para o número grande de ocupação.
 *
 * Busca e filtro continuam sendo `GET` nativo — o recorte vem renderizado do
 * servidor e a URL fica compartilhável. Só a paginação por cursor é incremental.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerList(props: ContainerListProps): JSX.Element {
  const items = toAccessor(() => props.vm.items());
  const isLoadingMore = toAccessor(() => props.vm.isLoadingMore());
  const errorMessage = toAccessor(() => props.vm.errorMessage());
  const hasMore = toAccessor(() => props.vm.hasMore());

  return (
    <section>
      <Toolbar
        eyebrow={props.vm.t.eyebrow}
        title={props.vm.t.title}
        search={{
          name: 'search',
          value: props.vm.filters.search,
          label: props.vm.t.search,
          placeholder: `${props.vm.t.search} ${props.vm.t.code.toLowerCase()}`,
          // O status ativo viaja junto, senão buscar apagaria o filtro.
          keep: props.vm.filters.status ? { status: props.vm.filters.status } : undefined,
        }}
      />

      <div class={styles.bar}>
        <FilterTabs
          label={props.vm.t.status}
          tabs={props.vm.statusOptions.map((option) => ({
            label: option.label,
            href: option.href,
            selected: option.selected,
          }))}
        />
        <Show when={props.vm.canCreate}>
          <a class={styles.newBtn} href={props.vm.newHref}>
            <Icon name="plus" size={16} />
            {props.vm.t.new}
          </a>
        </Show>
      </div>

      <Show
        when={items().length > 0}
        fallback={<EmptyState icon="container" message={props.vm.t.empty} />}
      >
        <CardList items={items()}>{(item) => <ContainerCard item={item} />}</CardList>
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
