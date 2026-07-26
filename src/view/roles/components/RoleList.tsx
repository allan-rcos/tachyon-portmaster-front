import { CardList } from '@view/core/components/CardList';
import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { Toolbar } from '@view/core/components/Toolbar';
import { InfiniteList } from '@view/core/islands/InfiniteList.island';
import { toAccessor } from '@view/core/observable/to-accessor';
import { RoleCard } from '@view/roles/components/RoleCard';
import type { RoleListVM } from '@viewmodel/roles/role-list-page.vm';
import { Show, type JSX } from 'solid-js';

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
export function RoleList(props: RoleListProps): JSX.Element {
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
        fallback={<EmptyState icon="shield" message={props.vm.t.empty} />}
      >
        <CardList items={items()} layout="column">
          {(item) => (
            <RoleCard
              item={item}
              editLabel={props.vm.t.edit}
              permissionsLabel={props.vm.t.permissionsCountLabel}
              usersLabel={props.vm.t.userCountLabel}
            />
          )}
        </CardList>
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
