import { ContainerActions } from '@view/containers/islands/ContainerActions.island';
import { ManifestEditor } from '@view/containers/islands/ManifestEditor.island';
import { Badge } from '@view/core/components/Badge';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { Card } from '@view/core/components/Card';
import { Icon } from '@view/core/components/Icon';
import type { ContainerDetailVM } from '@viewmodel/containers/container-detail-page.vm';
import type { JSX } from 'solid-js';

import styles from './ContainerSummary.module.scss';
import { ManifestTable } from './ManifestTable';
import { TelemetryLog } from './TelemetryLog';

/** Props do detalhe de contêiner. */
export interface ContainerSummaryProps {
  /** ViewModel da rota. */
  vm: ContainerDetailVM;
}

/**
 * Detalhe do contêiner: cabeçalho, fatos, ações, manifesto e telemetria.
 *
 * Tudo chega formatado pelo ViewModel — pesos, ocupação e datas já são string,
 * então não há aritmética nem `Intl` nesta camada. Os `ClientOnly` em volta das
 * islands saíram: o conteúdo agora vem do servidor e elas hidratam por cima.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerSummary(props: ContainerSummaryProps): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: props.vm.t.title, href: props.vm.listHref },
          { label: props.vm.facts.code },
        ]}
      />

      <header class={styles.head}>
        <div class={styles.title}>
          <h1 class={styles.code}>{props.vm.facts.code}</h1>
          <Badge tone={props.vm.facts.statusBadge.tone} dot>
            {props.vm.facts.statusBadge.label}
          </Badge>
        </div>
        <a class={styles.editLink} href={props.vm.facts.editHref}>
          <Icon name="pencil" size={16} />
          {props.vm.t.edit}
        </a>
      </header>

      <dl class={styles.facts}>
        <div>
          <dt>{props.vm.t.weight}</dt>
          <dd>{props.vm.facts.weight}</dd>
        </div>
        <div>
          <dt>{props.vm.t.capacity}</dt>
          <dd>{props.vm.facts.capacity}</dd>
        </div>
        <div>
          <dt>{props.vm.t.occupancy}</dt>
          <dd>{props.vm.facts.occupancy}</dd>
        </div>
      </dl>

      <ContainerActions vm={props.vm} />

      <div class={styles.grid}>
        <Card title={props.vm.t.manifest}>
          <ManifestTable items={props.vm.manifest} t={props.vm.t} />
          <ManifestEditor vm={props.vm} />
        </Card>

        <Card title={props.vm.t.logs}>
          <TelemetryLog logs={props.vm.logs} t={props.vm.t} />
        </Card>
      </div>
    </section>
  );
}
