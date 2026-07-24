import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import type { Role } from 'tachyon-portmaster-sdk/roles';

import styles from './RoleList.module.scss';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { DataTable, type Column } from '@/features/core/components/DataTable';
import { EmptyState } from '@/features/core/components/EmptyState';
import { Icon } from '@/features/core/components/Icon';
import { PageHeader } from '@/features/core/components/PageHeader';
import { formatNumber } from '@/features/core/utils/formatters';

/** Chaves de texto que esta lista consome (contrato — a página provê). */
export interface RoleListText {
  title: string;
  subtitle: string;
  new: string;
  name: string;
  userCount: string;
  permissions: string;
  actions: string;
  edit: string;
  empty: string;
}

export function RoleList(props: { items: Role[]; total: number; t: RoleListText }): JSX.Element {
  const columns = (): Column<Role>[] => [
    {
      header: props.t.name,
      cell: (r) => (
        <a class={styles.name} href={`/painel/perfis/${r.id}/permissoes`}>
          {r.name}
        </a>
      ),
    },
    { header: props.t.userCount, align: 'end', cell: (r) => formatNumber(r.user_count) },
    { header: props.t.permissions, align: 'end', cell: (r) => formatNumber(r.permissions.length) },
    {
      header: props.t.actions,
      align: 'end',
      cell: (r) => (
        <a
          class={styles.editLink}
          href={`/painel/perfis/${r.id}/permissoes`}
          aria-label={`${props.t.edit} ${r.name}`}
        >
          <Icon name="shield" size={16} />
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
          <a class={styles.newBtn} href="/painel/perfis/nova">
            <Icon name="plus" size={18} />
            {props.t.new}
          </a>
        }
      />
      <Show
        when={props.items.length > 0}
        fallback={<EmptyState icon="shield" message={props.t.empty} />}
      >
        <DataTable
          columns={columns()}
          rows={props.items}
          rowKey={(r) => r.id}
          caption={props.t.title}
        />
      </Show>
    </section>
  );
}
