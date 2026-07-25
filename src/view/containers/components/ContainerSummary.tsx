import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { Card } from '@view/core/components/Card';
import { Icon } from '@view/core/components/Icon';
import { StatusBadge } from '@view/core/components/StatusBadge';
import type { ContainerSummary as Summary } from '@viewmodel/containers/domain';
import type { ContainerDetailText } from '@viewmodel/containers/i18n/text-contracts';
import { formatWeight, formatPercent } from '@viewmodel/core/utils/formatters';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

import styles from './ContainerSummary.module.scss';
import { ManifestTable } from './ManifestTable';
import { TelemetryLog } from './TelemetryLog';
import { ContainerActions } from '../islands/ContainerActions.island';
import { ManifestEditor, type ProductOption } from '../islands/ManifestEditor.island';

function occupancy(weight: number, capacity: number): number {
  return capacity ? Math.round((weight / capacity) * 1000) / 10 : 0;
}

export function ContainerSummary(props: {
  summary: Summary;
  products: ProductOption[];
  t: ContainerDetailText;
}): JSX.Element {
  const c = () => props.summary.container;

  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.t.title, href: '/painel/conteineres' }, { label: c().code }]}
      />

      <header class={styles.head}>
        <div class={styles.title}>
          <h1 class={styles.code}>{c().code}</h1>
          <StatusBadge status={c().status} />
        </div>
        <a class={styles.editLink} href={`/painel/conteineres/${c().id}/editar`}>
          <Icon name="pencil" size={16} />
          {props.t.edit}
        </a>
      </header>

      <dl class={styles.facts}>
        <div>
          <dt>{props.t.weight}</dt>
          <dd>{formatWeight(c().current_weight)}</dd>
        </div>
        <div>
          <dt>{props.t.capacity}</dt>
          <dd>{formatWeight(c().max_capacity)}</dd>
        </div>
        <div>
          <dt>{props.t.occupancy}</dt>
          <dd>{formatPercent(occupancy(c().current_weight, c().max_capacity))}</dd>
        </div>
      </dl>

      <ClientOnly fallback={<span />}>
        <ContainerActions containerId={c().id} status={c().status} t={props.t} />
      </ClientOnly>

      <div class={styles.grid}>
        <Card title={props.t.manifest}>
          <ManifestTable items={props.summary.manifest} t={props.t} />
          <ClientOnly fallback={<span />}>
            <ManifestEditor containerId={c().id} products={props.products} t={props.t} />
          </ClientOnly>
        </Card>

        <Card title={props.t.logs}>
          <TelemetryLog logs={props.summary.recent_logs} t={props.t} />
        </Card>
      </div>
    </section>
  );
}

export type { ContainerDetailText };
