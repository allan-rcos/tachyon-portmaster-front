import { Badge } from '@view/core/components/Badge';
import { Icon } from '@view/core/components/Icon';
import type { ProductRowData } from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';

import styles from './ProductRow.module.scss';

export interface ProductRowProps {
  item: ProductRowData;
  /** Rótulo acessível do link de edição. */
  editLabel: string;
}

/**
 * Células de uma linha de produto, na ordem das colunas do `RowList`:
 * id · nome · densidade · classe de risco · ação.
 */
export function ProductRow(props: ProductRowProps): JSX.Element {
  return (
    <>
      <span class={styles.id}>{props.item.id}</span>
      <a class={styles.name} href={props.item.editHref}>
        {props.item.name}
      </a>
      <span class={styles.density}>{props.item.density}</span>
      <span class={styles.risk}>
        <Badge tone={props.item.risk.tone}>{props.item.risk.label}</Badge>
      </span>
      <span class={styles.action}>
        <a
          class={styles.edit}
          href={props.item.editHref}
          aria-label={`${props.editLabel} ${props.item.name}`}
        >
          <Icon name="pencil" size={15} />
        </a>
      </span>
    </>
  );
}
