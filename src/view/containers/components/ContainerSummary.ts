import { ContainerActions } from '@view/containers/islands/ContainerActions.island';
import { ManifestEditor } from '@view/containers/islands/ManifestEditor.island';
import { Badge } from '@view/core/components/Badge';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { Card } from '@view/core/components/Card';
import { Icon } from '@view/core/components/Icon';
import type { ContainerDetailVM } from '@viewmodel/containers/container-detail-page.vm';
import { html, type TemplateResult } from 'lit';

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
export function ContainerSummary(props: ContainerSummaryProps): TemplateResult {
  const { vm } = props;
  const facts = vm.facts;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: facts.code }] })}

    <header class=${styles.head}>
      <div class=${styles.title}>
        <h1 class=${styles.code}>${facts.code}</h1>
        ${Badge({ tone: facts.statusBadge.tone, dot: true, children: facts.statusBadge.label })}
      </div>
      <a class=${styles.editLink} href=${facts.editHref}>
        ${Icon({ name: 'pencil', size: 16 })} ${vm.t.edit}
      </a>
    </header>

    <dl class=${styles.facts}>
      <div>
        <dt>${vm.t.weight}</dt>
        <dd>${facts.weight}</dd>
      </div>
      <div>
        <dt>${vm.t.capacity}</dt>
        <dd>${facts.capacity}</dd>
      </div>
      <div>
        <dt>${vm.t.occupancy}</dt>
        <dd>${facts.occupancy}</dd>
      </div>
    </dl>

    ${ContainerActions({ vm })}

    <div class=${styles.grid}>
      ${Card({
        title: vm.t.manifest,
        children: html`${ManifestTable({ items: vm.manifest, t: vm.t })} ${ManifestEditor({ vm })}`,
      })}
      ${Card({
        title: vm.t.logs,
        children: TelemetryLog({ logs: vm.logs, t: vm.t }),
      })}
    </div>
  </section>`;
}
