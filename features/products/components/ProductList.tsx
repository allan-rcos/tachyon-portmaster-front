import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import styles from './ProductList.module.scss';

import type { Product } from '@/services/gen/flow/v1/product';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { DataTable, type Column } from '@/shared/components/DataTable';
import { EmptyState } from '@/shared/components/EmptyState';
import { Icon } from '@/shared/components/Icon';
import { PageHeader } from '@/shared/components/PageHeader';
import { RiskBadge } from '@/shared/components/RiskBadge';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { formatDensity } from '@/shared/utils/formatters';

export function ProductList(props: { items: Product[]; total: number; t: Messages }): JSX.Element {
  const columns = (): Column<Product>[] => [
    {
      header: props.t.name,
      cell: (p) => (
        <a class={styles.name} href={`/painel/produtos/${p.id}/editar`}>
          {p.name}
        </a>
      ),
    },
    { header: props.t.density, align: 'end', cell: (p) => formatDensity(p.density) },
    { header: props.t.riskClass, cell: (p) => <RiskBadge riskClass={p.risk_class} /> },
    {
      header: props.t.actions,
      align: 'end',
      cell: (p) => (
        <a
          class={styles.editLink}
          href={`/painel/produtos/${p.id}/editar`}
          aria-label={`${props.t.edit} ${p.name}`}
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
          <a class={styles.newBtn} href="/painel/produtos/nova">
            <Icon name="plus" size={18} />
            {props.t.new}
          </a>
        }
      />
      <Show
        when={props.items.length > 0}
        fallback={<EmptyState icon="flask" message={props.t.empty} />}
      >
        <DataTable
          columns={columns()}
          rows={props.items}
          rowKey={(p) => p.id}
          caption={props.t.title}
        />
      </Show>
    </section>
  );
}
