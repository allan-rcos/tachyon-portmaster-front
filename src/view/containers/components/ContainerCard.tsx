import { Badge } from '@view/core/components/Badge';
import type { ContainerRowData } from '@viewmodel/containers/container-list-page.vm';
import type { JSX } from 'solid-js';

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
export function ContainerCard(props: ContainerCardProps): JSX.Element {
  return (
    <a class={styles.card} href={props.item.detailHref} data-tone={props.item.status.tone}>
      <div class={styles.head}>
        <div>
          <div class={styles.code}>{props.item.code}</div>
          <div class={styles.capacity}>cap. {props.item.capacity}</div>
        </div>
        <Badge tone={props.item.status.tone} dot>
          {props.item.status.label}
        </Badge>
      </div>

      <div class={styles.body}>
        <div class={styles.silhouette} aria-hidden="true">
          <span class={styles.fill} style={{ height: `${props.item.occupancyValue}%` }} />
          <span class={styles.ribs} />
        </div>

        <div class={styles.meter}>
          <div class={styles.meterHead}>
            <span class={styles.percent}>{props.item.occupancy}</span>
            <span class={styles.weight}>
              {props.item.weight} / {props.item.capacity}
            </span>
          </div>
          <div class={styles.track}>
            <span class={styles.bar} style={{ width: `${props.item.occupancyValue}%` }} />
          </div>
        </div>
      </div>
    </a>
  );
}
