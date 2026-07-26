import { EmptyState } from '@view/core/components/EmptyState';
import type { ManifestRowData } from '@viewmodel/containers/container-detail-page.vm';
import type { ContainerDetailPageText } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { For, Show, type JSX } from 'solid-js';

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
 * @param props.items Linhas do manifesto.
 * @param props.t     Texto do cluster de detalhe.
 */
export function ManifestTable(props: ManifestTableProps): JSX.Element {
  return (
    <Show
      when={props.items.length > 0}
      fallback={<EmptyState icon="package" message={props.t.emptyManifest} />}
    >
      <table class={styles.table}>
        <caption class="srOnly">{props.t.manifest}</caption>
        <thead>
          <tr>
            <th>{props.t.product}</th>
            <th data-align="end">{props.t.quantity}</th>
            <th data-align="end">{props.t.weight}</th>
          </tr>
        </thead>
        <tbody>
          <For each={[...props.items]}>
            {(item) => (
              <tr>
                <td>{item.productName}</td>
                <td data-align="end">{item.quantity}</td>
                <td data-align="end">{item.weight}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </Show>
  );
}
