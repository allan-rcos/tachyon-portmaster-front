import { Badge } from '@view/core/components/Badge';
import type { ContainerRowData } from '@viewmodel/containers/container-list-page.vm';
import { html, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import styles from './ContainerCard.module.scss';

export interface ContainerCardProps {
  /** Linha já formatada pelo ViewModel — nada a calcular aqui. */
  item: ContainerRowData;
}

/**
 * Cartão de contêiner: código, capacidade, silhueta preenchida, ocupação e
 * barra de progresso, tudo no tom do status.
 *
 * O cartão inteiro é o link para o detalhe — é o que o protótipo faz, e evita
 * um alvo de toque pequeno dentro de uma área grande e clicável só na aparência.
 */
export function ContainerCard(props: ContainerCardProps): TemplateResult {
  const item = props.item;

  return html`<a class=${styles.card} href=${item.detailHref} data-tone=${item.status.tone}>
    <div class=${styles.head}>
      <div>
        <div class=${styles.code}>${item.code}</div>
        <div class=${styles.capacity}>cap. ${item.capacity}</div>
      </div>
      ${Badge({ tone: item.status.tone, dot: true, children: item.status.label })}
    </div>

    <div class=${styles.body}>
      <div class=${styles.silhouette} aria-hidden="true">
        <span class=${styles.fill} style=${styleMap({ height: `${item.occupancyValue}%` })}></span>
        <span class=${styles.ribs}></span>
      </div>

      <div class=${styles.meter}>
        <div class=${styles.meterHead}>
          <span class=${styles.percent}>${item.occupancy}</span>
          <span class=${styles.weight}>${item.weight} / ${item.capacity}</span>
        </div>
        <div class=${styles.track}>
          <span class=${styles.bar} style=${styleMap({ width: `${item.occupancyValue}%` })}></span>
        </div>
      </div>
    </div>
  </a>`;
}
