import { EmptyState } from '@view/core/components/EmptyState';
import type { CargoManifestItem } from '@viewmodel/containers/domain';
import { formatNumber, formatWeight } from '@viewmodel/core/utils/formatters';
import { For, Show, type JSX } from 'solid-js';

import type { ContainerDetailText } from './ContainerSummary';
import styles from './ManifestTable.module.scss';

/** Manifesto de carga (SSR). */
export function ManifestTable(props: {
  items: CargoManifestItem[];
  t: ContainerDetailText;
}): JSX.Element {
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
          <For each={props.items}>
            {(item) => (
              <tr>
                <td>{item.product_name}</td>
                <td data-align="end">{formatNumber(item.quantity)}</td>
                <td data-align="end">{formatWeight(item.weight)}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </Show>
  );
}
