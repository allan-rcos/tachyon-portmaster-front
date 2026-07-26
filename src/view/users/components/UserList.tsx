import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { RowList } from '@view/core/components/RowList';
import { Toolbar } from '@view/core/components/Toolbar';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import { toAccessor } from '@view/core/observable/to-accessor';
import { UserRow } from '@view/users/components/UserRow';
import type { UserListVM } from '@viewmodel/users/user-list-page.vm';
import { Show, type JSX } from 'solid-js';

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
export function UserList(props: UserListProps): JSX.Element {
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
        fallback={<EmptyState icon="users" message={props.vm.t.empty} />}
      >
        <RowList
          columns="1.3fr 1.3fr 1.2fr 96px"
          mobile={{ columns: '1fr auto', areas: "'user action' 'email email' 'roles roles'" }}
          headers={[props.vm.t.name, props.vm.t.email, props.vm.t.roles, '']}
          items={items()}
        >
          {(item) => <UserRow item={item} editLabel={props.vm.t.edit} />}
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
