import { toAccessor } from '@view/core/observable/to-accessor';
import type { OptionGroup } from '@viewmodel/core/page/options';
import { For, type JSX } from 'solid-js';

import styles from './PermissionMatrix.module.scss';

export interface PermissionMatrixProps {
  /** Grupos de permissões, com rótulos já resolvidos pelo ViewModel. */
  groups: readonly OptionGroup[];
  /** Um valor está marcado? Vem do ViewModel da rota. */
  isSelected: (value: string) => boolean;
  onToggle: (value: string, checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Grade de caixas de seleção agrupadas. Controlada pelo ViewModel da rota
 * (recebe o predicado de seleção + callback).
 *
 * Os valores são opacos de propósito: este componente não sabe o que é uma
 * `Permission`, e é isso que mantém a View sem DTO do Model. Quem cobra que os
 * valores marcados sejam permissões válidas é o schema, na submissão.
 *
 * A seleção chega como PREDICADO e não como `Set`: o `Set` obrigava a rota a
 * materializar a seleção inteira a cada mudança, e uma caixa marcada
 * reconstruía a estrutura toda. O predicado é lido por caixa, dentro de um
 * acessor próprio — então marcar uma permissão só invalida aquela.
 */
export function PermissionMatrix(props: PermissionMatrixProps): JSX.Element {
  return (
    <div class={styles.grid}>
      <For each={props.groups}>
        {(group) => (
          <fieldset class={styles.group} disabled={props.disabled}>
            <legend class={styles.legend}>{group.label}</legend>
            <For each={group.options}>
              {(option) => {
                // Um acessor por caixa, criado uma vez: o callback do `For` roda
                // por item, não por render.
                const checked = toAccessor(() => props.isSelected(option.value));
                return (
                  <label class={styles.item}>
                    <input
                      type="checkbox"
                      checked={checked()}
                      onChange={(e) => props.onToggle(option.value, e.currentTarget.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              }}
            </For>
          </fieldset>
        )}
      </For>
    </div>
  );
}
