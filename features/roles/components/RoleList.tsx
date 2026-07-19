import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import styles from './RoleList.module.scss';

import type { Role } from '@/services/gen/flow/v1/admin';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { DataTable, type Column } from '@/shared/components/DataTable';
import { EmptyState } from '@/shared/components/EmptyState';
import { Icon } from '@/shared/components/Icon';
import { PageHeader } from '@/shared/components/PageHeader';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { formatNumber } from '@/shared/utils/formatters';

export function RoleList(props: { items: Role[]; total: number; t: Messages }): JSX.Element {
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
