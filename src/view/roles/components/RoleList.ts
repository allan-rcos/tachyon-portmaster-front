import { CardList } from '@view/core/components/CardList';
import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { Toolbar } from '@view/core/components/Toolbar';
import { island } from '@view/core/island/mount';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import { RoleCard } from '@view/roles/components/RoleCard';
import type { RoleListVM, RoleRowData } from '@viewmodel/roles/role-list-page.vm';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './RoleList.module.scss';

/** Props da listagem de perfis. */
export interface RoleListProps {
  /** ViewModel da rota. */
  vm: RoleListVM;
}

/**
 * Listagem de perfis — `CardList` empilhado, um cartão por perfil.
 *
 * Perfil não cabe numa linha: o que interessa de um perfil é o CONJUNTO de
 * permissões que ele concede, e isso são dezenas de chips. O protótipo desenha
 * cada perfil como um cartão largo com as chips por baixo do cabeçalho.
 *
 * @param props.vm ViewModel da rota.
 */
export function RoleList(props: RoleListProps): TemplateResult {
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
        ? CardList<RoleRowData>({
            items,
            layout: 'column',
            children: (item) =>
              RoleCard({
                item,
                editLabel: vm.t.edit,
                permissionsLabel: vm.t.permissionsCountLabel,
                usersLabel: vm.t.userCountLabel,
              }),
          })
        : EmptyState({ icon: 'shield', message: vm.t.empty })
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
