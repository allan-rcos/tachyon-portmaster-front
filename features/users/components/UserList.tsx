import { For, Show, type JSX } from 'solid-js';

import styles from './UserList.module.scss';

import type { UserAdmin } from '@/services/gen/flow/v1/admin';
import { Badge } from '@/shared/components/Badge';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { DataTable, type Column } from '@/shared/components/DataTable';
import { EmptyState } from '@/shared/components/EmptyState';
import { Icon } from '@/shared/components/Icon';
import { PageHeader } from '@/shared/components/PageHeader';
import type { Messages } from '@/shared/i18n/messages/pt-BR';

export function UserList(props: { items: UserAdmin[]; total: number; t: Messages }): JSX.Element {
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
