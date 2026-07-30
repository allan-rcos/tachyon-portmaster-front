import type { OptionGroup } from '@viewmodel/core/page/options';
import { html, type TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';

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
 * A seleção chega como PREDICADO e não como `Set`: com o effect raiz reavaliando
 * o template, um `Set` novo a cada render seria alocação sem propósito — e o
 * predicado lê o signal do ViewModel no momento do desenho, que é o que registra
 * a dependência.
 */
export function PermissionMatrix(props: PermissionMatrixProps): TemplateResult {
  return html`<div class=${styles.grid}>
    ${props.groups.map(
      (group) =>
        html`<fieldset class=${styles.group} ?disabled=${props.disabled}>
          <legend class=${styles.legend}>${group.label}</legend>
          ${group.options.map(
          (option) =>
            html`<label class=${styles.item}>
              <input
                type="checkbox"
                .checked=${live(props.isSelected(option.value))}
                @change=${(e: Event) =>
                props.onToggle(option.value, (e.currentTarget as HTMLInputElement).checked)}
              />
              <span>${option.label}</span>
            </label>`,
        )}
        </fieldset>`,
    )}
  </div>`;
}
