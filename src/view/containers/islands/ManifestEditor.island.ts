import { FormField } from '@view/core/components/FormField';
import { Icon } from '@view/core/components/Icon';
import type { ManifestEditorVM } from '@viewmodel/containers/vm-contracts';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './ManifestEditor.island.module.scss';

export interface ManifestEditorProps {
  /** ViewModel da rota — dono do estado do editor. */
  vm: ManifestEditorVM;
}

/**
 * Editor de manifesto: carrega/descarrega itens.
 *
 * Sem estado próprio — nem os valores, nem o `target` que decidia qual mutation
 * o submit aplicaria. Aquele `createSignal<'load' | 'unload'>` existia só porque
 * o `@tanstack/solid-form` tinha um único `onSubmit`; com dois handlers
 * explícitos (`vm.load()` / `vm.unload()`) o desvio desaparece.
 *
 * Carregar/descarregar altera o peso e o status do contêiner, exibidos por
 * outros componentes da mesma tela — recarregar é a forma mais barata de manter
 * todos consistentes.
 *
 * @param props.vm ViewModel da rota.
 */
export function ManifestEditor(props: ManifestEditorProps): TemplateResult {
  const { vm } = props;
  const pending = vm.manifestPending();

  const reloadIfOk = (ok: boolean) => {
    if (ok) window.location.reload();
  };

  return html`<form class=${styles.form} @submit=${(e: Event) => e.preventDefault()}>
    <fieldset class=${styles.fields} ?disabled=${pending}>
      <legend class="srOnly">${vm.t.manifest}</legend>

      ${FormField({
        label: vm.t.product,
        for: 'mani-product',
        error: vm.manifestError('product_id'),
        children: html`<select
          id="mani-product"
          class=${styles.select}
          .value=${live(vm.manifestValue('product_id'))}
          @change=${(e: Event) =>
            vm.setManifest('product_id', (e.currentTarget as HTMLSelectElement).value)}
        >
          ${vm.products.map((p) => html`<option value=${p.id}>${p.name}</option>`)}
        </select>`,
      })}
      ${FormField({
        label: vm.t.quantity,
        for: 'mani-qty',
        error: vm.manifestError('quantity'),
        children: html`<input
          id="mani-qty"
          type="number"
          min="1"
          class=${classMap({
            [styles.input]: true,
            [styles.invalid]: Boolean(vm.manifestError('quantity')),
          })}
          .value=${live(vm.manifestValue('quantity'))}
          placeholder="0"
          @input=${(e: Event) =>
            vm.setManifest('quantity', (e.currentTarget as HTMLInputElement).value)}
          @blur=${() => vm.blurManifest('quantity')}
        />`,
      })}
    </fieldset>

    <menu class=${styles.actions}>
      <li>
        <button
          type="button"
          class=${styles.load}
          @click=${() => void vm.load().then(reloadIfOk)}
          ?disabled=${pending}
        >
          ${Icon({ name: 'plus', size: 16 })} ${vm.t.load}
        </button>
      </li>
      <li>
        <button
          type="button"
          class=${styles.unload}
          @click=${() => void vm.unload().then(reloadIfOk)}
          ?disabled=${pending}
        >
          ${Icon({ name: 'rotate', size: 16 })} ${vm.t.unload}
        </button>
      </li>
    </menu>
  </form>`;
}
