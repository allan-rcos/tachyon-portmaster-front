import { Show, type JSX } from 'solid-js';
import { For } from 'solid-js';
import { CONTAINER_STATUS } from 'tachyon-portmaster-sdk/common';
import type { Container } from 'tachyon-portmaster-sdk/containers';

import styles from './ContainerList.module.scss';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { DataTable, type Column } from '@/features/core/components/DataTable';
import { EmptyState } from '@/features/core/components/EmptyState';
import { Icon } from '@/features/core/components/Icon';
import { PageHeader } from '@/features/core/components/PageHeader';
import { Pagination } from '@/features/core/components/Pagination';
import { StatusBadge } from '@/features/core/components/StatusBadge';
import { CONTAINER_STATUS_LABEL } from '@/features/core/i18n/labels';
import { formatWeight, formatPercent } from '@/features/core/utils/formatters';

/** Chaves de texto que esta lista consome (contrato — a página provê os valores). */
export interface ContainerListText {
  title: string;
  subtitle: string;
  new: string;
  code: string;
  status: string;
  weight: string;
  capacity: string;
  occupancy: string;
  actions: string;
  edit: string;
  search: string;
  empty: string;
  previous: string;
  next: string;
}

export interface ContainerListProps {
  items: Container[];
  total: number;
  nextCursor?: string;
  filters: { search: string; status: string };
  t: ContainerListText;
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
