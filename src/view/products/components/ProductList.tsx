import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { DataTable, type Column } from '@view/core/components/DataTable';
import { EmptyState } from '@view/core/components/EmptyState';
import { Icon } from '@view/core/components/Icon';
import { PageHeader } from '@view/core/components/PageHeader';
import { RiskBadge } from '@view/core/components/RiskBadge';
import { formatDensity } from '@viewmodel/core/utils/formatters';
import type { Product } from '@viewmodel/products/domain';
import type { ProductListText } from '@viewmodel/products/i18n/text-contracts';
import { Show } from 'solid-js';
import type { JSX } from 'solid-js';

import styles from './ProductList.module.scss';

export function ProductList(props: {
  items: Product[];
  total: number;
  t: ProductListText;
}): JSX.Element {
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

export type { ProductListText };
