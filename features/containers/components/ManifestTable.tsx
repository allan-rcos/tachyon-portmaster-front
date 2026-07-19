import { For, Show, type JSX } from 'solid-js';

import styles from './ManifestTable.module.scss';

import type { CargoManifestItem } from '@/services/gen/flow/v1/container';
import { EmptyState } from '@/shared/components/EmptyState';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { formatNumber, formatWeight } from '@/shared/utils/formatters';

/** Manifesto de carga (SSR). */
export function ManifestTable(props: { items: CargoManifestItem[]; t: Messages }): JSX.Element {
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
