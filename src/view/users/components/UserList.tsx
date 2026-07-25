import { Badge } from '@view/core/components/Badge';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { DataTable, type Column } from '@view/core/components/DataTable';
import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { PageHeader } from '@view/core/components/PageHeader';
import type { UserAdmin } from '@viewmodel/users/domain';
import type { UserListText } from '@viewmodel/users/i18n/text-contracts';
import { For, Show, type JSX } from 'solid-js';

import styles from './UserList.module.scss';

export function UserList(props: {
  items: UserAdmin[];
  total: number;
  t: UserListText;
}): JSX.Element {
  const columns = (): Column<UserAdmin>[] => [
    {
      header: props.t.name,
      cell: (u) => (
        <a class={styles.name} href={`/painel/usuarios/${u.id}/editar`}>
          {u.name}
        </a>
      ),
    },
    { header: props.t.email, cell: (u) => <span class={styles.email}>{u.email}</span> },
    {
      header: props.t.roles,
      cell: (u) => (
        <span class={styles.roles}>
          <For each={u.roles}>{(r) => <Badge tone="teal">{r.name}</Badge>}</For>
        </span>
      ),
    },
    {
      header: props.t.actions,
      align: 'end',
      cell: (u) => (
        <a
          class={styles.editLink}
          href={`/painel/usuarios/${u.id}/editar`}
          aria-label={`${props.t.edit} ${u.name}`}
        >
          <Icon name="pencil" size={16} />
        </a>
      ),
    },
  ];

  return (
    <section>
      <Breadcrumbs items={[{ label: props.t.title }]} />
      <PageHeader
        title={props.t.title}
        subtitle={props.t.subtitle}
        action={
          <a class={styles.newBtn} href="/painel/usuarios/nova">
            <Icon name="plus" size={18} />
            {props.t.new}
          </a>
        }
      />
      <Show
        when={props.items.length > 0}
        fallback={<EmptyState icon="users" message={props.t.empty} />}
      >
        <DataTable
          columns={columns()}
          rows={props.items}
          rowKey={(u) => u.id}
          caption={props.t.title}
        />
      </Show>
    </section>
  );
}

export type { UserListText };
