import { For, Show, type JSX } from 'solid-js';
import type { UserAdmin } from 'tachyon-portmaster-sdk/users';

import styles from './UserList.module.scss';

import { Badge } from '@/features/core/components/Badge';
import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { DataTable, type Column } from '@/features/core/components/DataTable';
import { EmptyState } from '@/features/core/components/EmptyState';
import { Icon } from '@/features/core/components/Icon';
import { PageHeader } from '@/features/core/components/PageHeader';

/** Chaves de texto que esta lista consome (contrato — a página provê). */
export interface UserListText {
  title: string;
  subtitle: string;
  new: string;
  name: string;
  email: string;
  roles: string;
  actions: string;
  edit: string;
  empty: string;
}

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
