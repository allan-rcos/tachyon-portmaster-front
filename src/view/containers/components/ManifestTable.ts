import { EmptyState } from '@view/core/components/EmptyState';
import type { ManifestRowData } from '@viewmodel/containers/container-detail-page.vm';
import type { ContainerDetailPageText } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { html, type TemplateResult } from 'lit';

import styles from './ManifestTable.module.scss';

/** Props do manifesto de carga. */
export interface ManifestTableProps {
  /** Linhas já formatadas pelo ViewModel. */
  items: readonly ManifestRowData[];
  /** Texto do cluster de detalhe. */
  t: ContainerDetailPageText;
}

/**
 * Manifesto de carga (SSR). Quantidade e peso já chegam formatados.
 *
 * Aqui `<table>` é o elemento certo, ao contrário do `RowList`: são dados
 * tabulares de verdade, com cabeçalho que rotula colunas.
 *
 * @param props.items Linhas do manifesto.
 * @param props.t     Texto do cluster de detalhe.
 */
export function ManifestTable(props: ManifestTableProps): TemplateResult {
  if (props.items.length === 0) {
    return EmptyState({ icon: 'package', message: props.t.emptyManifest });
  }

  return html`<table class=${styles.table}>
    <caption class="srOnly">
      ${props.t.manifest}
    </caption>
    <thead>
      <tr>
        <th>${props.t.product}</th>
        <th data-align="end">${props.t.quantity}</th>
        <th data-align="end">${props.t.weight}</th>
      </tr>
    </thead>
    <tbody>
      ${props.items.map(
        (item) =>
          html`<tr>
            <td>${item.productName}</td>
            <td data-align="end">${item.quantity}</td>
            <td data-align="end">${item.weight}</td>
          </tr>`,
      )}
    </tbody>
  </table>`;
}
