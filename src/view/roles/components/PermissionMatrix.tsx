import type { OptionGroup } from '@viewmodel/core/page/options';
import { For, type JSX } from 'solid-js';

import styles from './PermissionMatrix.module.scss';

export interface PermissionMatrixProps {
  /** Grupos de permissões, com rótulos já resolvidos pelo ViewModel. */
  groups: readonly OptionGroup[];
  /** Valores marcados no momento. */
  selected: ReadonlySet<string>;
  onToggle: (value: string, checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Grade de caixas de seleção agrupadas. Controlada pela island de perfil
 * (recebe seleção + callback).
 *
 * Os valores são opacos de propósito: este componente não sabe o que é uma
 * `Permission`, e é isso que mantém a View sem DTO do Model. Quem cobra que os
 * valores marcados sejam permissões válidas é o schema, na submissão.
 */
export function PermissionMatrix(props: PermissionMatrixProps): JSX.Element {
  return (
    <div class={styles.grid}>
      <For each={props.groups}>
        {(group) => (
          <fieldset class={styles.group} disabled={props.disabled}>
            <legend class={styles.legend}>{group.label}</legend>
            <For each={group.options}>
              {(option) => (
                <label class={styles.item}>
                  <input
                    type="checkbox"
                    checked={props.selected.has(option.value)}
                    onChange={(e) => props.onToggle(option.value, e.currentTarget.checked)}
                  />
                  <span>{option.label}</span>
                </label>
              )}
            </For>
          </fieldset>
        )}
      </For>
    </div>
  );
}
