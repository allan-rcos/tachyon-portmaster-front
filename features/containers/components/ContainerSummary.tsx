import type { JSX } from 'solid-js';
import type { ContainerSummary as Summary } from 'tachyon-portmaster-sdk/containers';
import { ClientOnly } from 'vike-solid/ClientOnly';

import styles from './ContainerSummary.module.scss';
import { ManifestTable } from './ManifestTable';
import { TelemetryLog } from './TelemetryLog';
import { ContainerActions } from '../islands/ContainerActions.island';
import { ManifestEditor, type ProductOption } from '../islands/ManifestEditor.island';

import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { Card } from '@/features/core/components/Card';
import { Icon } from '@/features/core/components/Icon';
import { StatusBadge } from '@/features/core/components/StatusBadge';
import { formatWeight, formatPercent } from '@/features/core/utils/formatters';

/**
 * Texto do detalhe do contêiner (contrato do cluster: ContainerSummary +
 * ManifestTable + TelemetryLog + ContainerActions + ManifestEditor). Um único
 * `t` resolvido na página alimenta todos; cada um usa o subconjunto que precisa.
 */
export interface ContainerDetailText {
  title: string;
  edit: string;
  weight: string;
  capacity: string;
  occupancy: string;
  manifest: string;
  logs: string;
  emptyManifest: string;
  product: string;
  quantity: string;
  empty: string;
  seal: string;
  dispatch: string;
  delete: string;
  sealConfirm: string;
  dispatchConfirm: string;
  deleteConfirm: string;
  cancel: string;
  load: string;
  unload: string;
  productRequired: string;
  quantityPositive: string;
}

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
