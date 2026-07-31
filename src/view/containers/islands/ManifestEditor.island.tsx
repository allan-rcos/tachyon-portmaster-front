import { FormField } from '@view/core/components/FormField';
import { Icon } from '@view/core/components/Icon';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { ManifestEditorVM } from '@viewmodel/containers/vm-contracts';
import { For, type JSX } from 'solid-js';

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
export function ManifestEditor(props: ManifestEditorProps): JSX.Element {
  const productId = {
    value: toAccessor(() => props.vm.manifestValue('product_id')),
    error: toAccessor(() => props.vm.manifestError('product_id')),
  };
  const quantity = {
    value: toAccessor(() => props.vm.manifestValue('quantity')),
    error: toAccessor(() => props.vm.manifestError('quantity')),
  };

  const pending = toAccessor(() => props.vm.manifestPending());

  const reloadIfOk = (ok: boolean) => {
    if (ok) window.location.reload();
  };

  return (
    <form class={styles.form} onSubmit={(e) => e.preventDefault()}>
      <fieldset class={styles.fields} disabled={pending()}>
        <legend class="srOnly">{props.vm.t.manifest}</legend>

        <FormField label={props.vm.t.product} for="mani-product" error={productId.error()}>
          <select
            id="mani-product"
            class={styles.select}
            value={productId.value()}
            onChange={(e) => props.vm.setManifest('product_id', e.currentTarget.value)}
          >
            <For each={props.vm.products}>{(p) => <option value={p.id}>{p.name}</option>}</For>
          </select>
        </FormField>

        <FormField label={props.vm.t.quantity} for="mani-qty" error={quantity.error()}>
          <input
            id="mani-qty"
            type="number"
            min="1"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(quantity.error()) }}
            value={quantity.value()}
            onInput={(e) => props.vm.setManifest('quantity', e.currentTarget.value)}
            onBlur={() => props.vm.blurManifest('quantity')}
            placeholder="0"
          />
        </FormField>
      </fieldset>

      <menu class={styles.actions}>
        <li>
          <button
            type="button"
            class={styles.load}
            onClick={() => void props.vm.load().then(reloadIfOk)}
            disabled={pending()}
          >
            <Icon name="plus" size={16} />
            {props.vm.t.load}
          </button>
        </li>
        <li>
          <button
            type="button"
            class={styles.unload}
            onClick={() => void props.vm.unload().then(reloadIfOk)}
            disabled={pending()}
          >
            <Icon name="rotate" size={16} />
            {props.vm.t.unload}
          </button>
        </li>
      </menu>
    </form>
  );
}
