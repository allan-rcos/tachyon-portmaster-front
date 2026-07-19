import { Show, type JSX } from 'solid-js';
import { For } from 'solid-js';

import styles from './ContainerList.module.scss';

import { CONTAINER_STATUS } from '@/services/gen/flow/v1/common';
import type { Container } from '@/services/gen/flow/v1/container';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { DataTable, type Column } from '@/shared/components/DataTable';
import { EmptyState } from '@/shared/components/EmptyState';
import { Icon } from '@/shared/components/Icon';
import { PageHeader } from '@/shared/components/PageHeader';
import { Pagination } from '@/shared/components/Pagination';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CONTAINER_STATUS_LABEL } from '@/shared/i18n/labels';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { formatWeight, formatPercent } from '@/shared/utils/formatters';

export interface ContainerListProps {
  items: Container[];
  total: number;
  nextCursor?: string;
  filters: { search: string; status: string };
  t: Messages;
}

function occupancy(c: Container): number {
  return c.max_capacity ? Math.round((c.current_weight / c.max_capacity) * 1000) / 10 : 0;
}

function buildHref(filters: { search: string; status: string }, cursor?: string): string {
  const p = new URLSearchParams();
  if (filters.search) p.set('search', filters.search);
  if (filters.status) p.set('status', filters.status);
  if (cursor) p.set('cursor', cursor);
  const s = p.toString();
  return s ? `/painel/conteineres?${s}` : '/painel/conteineres';
}

export function ContainerList(props: ContainerListProps): JSX.Element {
  const columns = (): Column<Container>[] => [
    {
      header: props.t.code,
      cell: (c) => (
        <a class={styles.code} href={`/painel/conteineres/${c.id}`}>
          {c.code}
        </a>
      ),
    },
    { header: props.t.status, cell: (c) => <StatusBadge status={c.status} /> },
    { header: props.t.weight, align: 'end', cell: (c) => formatWeight(c.current_weight) },
    { header: props.t.capacity, align: 'end', cell: (c) => formatWeight(c.max_capacity) },
    {
      header: props.t.occupancy,
      cell: (c) => (
        <div class={styles.occ}>
          <div class={styles.occBar}>
            <span style={{ width: `${Math.min(occupancy(c), 100)}%` }} />
          </div>
          <span class={styles.occVal}>{formatPercent(occupancy(c))}</span>
        </div>
      ),
    },
    {
      header: props.t.actions,
      align: 'end',
      cell: (c) => (
        <a
          class={styles.editLink}
          href={`/painel/conteineres/${c.id}/editar`}
          aria-label={`${props.t.edit} ${c.code}`}
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
          <a class={styles.newBtn} href="/painel/conteineres/nova">
            <Icon name="plus" size={18} />
            {props.t.new}
          </a>
        }
      />

      <form class={styles.filters} method="get" role="search">
        <div class={styles.searchBox}>
          <Icon name="search" size={16} />
          <input
            name="search"
            value={props.filters.search}
            placeholder={`${props.t.search} ${props.t.code.toLowerCase()}`}
          />
        </div>
        <select name="status" aria-label={props.t.status}>
          <option value="">{props.t.status}: todos</option>
          <For each={CONTAINER_STATUS}>
            {(s) => (
              <option value={s} selected={props.filters.status === s}>
                {CONTAINER_STATUS_LABEL[s]}
              </option>
            )}
          </For>
        </select>
        <button type="submit" class={styles.filterBtn}>
          {props.t.search}
        </button>
      </form>

      <Show
        when={props.items.length > 0}
        fallback={<EmptyState icon="container" message={props.t.empty} />}
      >
        <DataTable
          columns={columns()}
          rows={props.items}
          rowKey={(c) => c.id}
          caption={props.t.title}
        />
        <Pagination
          total={props.total}
          shown={props.items.length}
          prevHref={
            props.filters.search || props.filters.status ? buildHref(props.filters) : undefined
          }
          nextHref={props.nextCursor ? buildHref(props.filters, props.nextCursor) : undefined}
          labels={{ previous: props.t.previous, next: props.t.next }}
        />
      </Show>
    </section>
  );
}
