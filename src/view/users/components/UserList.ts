import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { RowList } from '@view/core/components/RowList';
import { Toolbar } from '@view/core/components/Toolbar';
import { island } from '@view/core/island/mount';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import { UserRow } from '@view/users/components/UserRow';
import type { UserListVM, UserRowData } from '@viewmodel/users/user-list-page.vm';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './UserList.module.scss';

/** Props da listagem de usuários. */
export interface UserListProps {
  /** ViewModel da rota. */
  vm: UserListVM;
}

/**
 * Listagem de usuários — `RowList` com a grade medida no protótipo
 * (`1.3fr 1.3fr 1.2fr 96px`). No mobile a linha vira folha: nome + ação em
 * cima, e-mail e perfis embaixo.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserList(props: UserListProps): TemplateResult {
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
        ? RowList<UserRowData>({
            columns: '1.3fr 1.3fr 1.2fr 96px',
            mobile: { columns: '1fr auto', areas: "'user action' 'email email' 'roles roles'" },
            headers: [vm.t.name, vm.t.email, vm.t.roles, ''],
            items,
            children: (item) => UserRow({ item, editLabel: vm.t.edit }),
          })
        : EmptyState({ icon: 'users', message: vm.t.empty })
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
