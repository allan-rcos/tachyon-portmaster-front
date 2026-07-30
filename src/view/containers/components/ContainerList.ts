import { ContainerCard } from '@view/containers/components/ContainerCard';
import { CardList } from '@view/core/components/CardList';
import { EmptyState } from '@view/core/components/EmptyState';
import { FilterTabs } from '@view/core/components/FilterTabs';
import { Icon } from '@view/core/components/Icon';
import { Toolbar } from '@view/core/components/Toolbar';
import { island } from '@view/core/island/mount';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import type {
  ContainerListVM,
  ContainerRowData,
} from '@viewmodel/containers/container-list-page.vm';
import { html, nothing, type TemplateResult } from 'lit';

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
export function ContainerList(props: ContainerListProps): TemplateResult {
  const { vm } = props;
  const items = vm.items();

  return html`<section>
    ${Toolbar({
      eyebrow: vm.t.eyebrow,
      title: vm.t.title,
      search: {
        name: 'search',
        value: vm.filters.search,
        label: vm.t.search,
        placeholder: `${vm.t.search} ${vm.t.code.toLowerCase()}`,
        // O status ativo viaja junto, senão buscar apagaria o filtro.
        keep: vm.filters.status ? { status: vm.filters.status } : undefined,
      },
    })}

    <div class=${styles.bar}>
      ${FilterTabs({
        label: vm.t.status,
        tabs: vm.statusOptions.map((option) => ({
          label: option.label,
          href: option.href,
          selected: option.selected,
        })),
      })}
      ${
        vm.canCreate
          ? html`<a class=${styles.newBtn} href=${vm.newHref}>
              ${Icon({ name: 'plus', size: 16 })} ${vm.t.new}
            </a>`
          : nothing
      }
    </div>

    ${
      items.length > 0
        ? CardList<ContainerRowData>({
            items,
            children: (item) => ContainerCard({ item }),
          })
        : EmptyState({ icon: 'container', message: vm.t.empty })
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
