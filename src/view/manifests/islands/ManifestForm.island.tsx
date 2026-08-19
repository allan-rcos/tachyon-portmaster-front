import { FormField } from '@view/core/components/FormField';
import { Icon } from '@view/core/components/Icon';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { ManifestField, ManifestVM } from '@viewmodel/manifests/manifest-page.vm';
import { For, Show, type JSX } from 'solid-js';

import styles from './ManifestForm.island.module.scss';

export interface ManifestFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: ManifestVM;
}

/**
 * Formulário de movimentação de carga.
 *
 * Como as outras ilhas de formulário do projeto, não guarda estado: modo,
 * seleção, quantidade e previsão moram no `ManifestVM`. Aqui só desenho.
 *
 * As abas são `role="tab"` de verdade e não dois botões soltos: o par
 * carregar/descarregar é uma escolha entre painéis do MESMO formulário, e é
 * assim que um leitor de tela precisa ouvir.
 *
 * @param props.vm ViewModel da rota.
 */
export function ManifestForm(props: ManifestFormProps): JSX.Element {
  const field = (name: ManifestField) => ({
    value: toAccessor(() => props.vm.value(name)),
    error: toAccessor(() => props.vm.error(name)),
  });

  const container = field('container_id');
  const product = field('product_id');
  const quantity = field('quantity');

  const mode = toAccessor(() => props.vm.mode());
  const preview = toAccessor(() => props.vm.preview());
  const submitting = toAccessor(() => props.vm.submitting());
  const failed = toAccessor(() => props.vm.failed());
  const succeeded = toAccessor(() => props.vm.succeeded());

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void props.vm.submit();
  };

  return (
    <form class={styles.form} onSubmit={submit}>
      <p class={styles.desc}>{props.vm.description()}</p>

      <div class={styles.tabs} role="tablist" aria-label={props.vm.t.move}>
        <button
          type="button"
          role="tab"
          class={styles.tab}
          classList={{ [styles.active]: mode() === 'load' }}
          aria-selected={mode() === 'load'}
          disabled={!props.vm.canLoad}
          onClick={() => props.vm.setMode('load')}
        >
          {props.vm.t.load}
        </button>
        <button
          type="button"
          role="tab"
          class={styles.tab}
          classList={{ [styles.active]: mode() === 'unload' }}
          aria-selected={mode() === 'unload'}
          disabled={!props.vm.canUnload}
          onClick={() => props.vm.setMode('unload')}
        >
          {props.vm.t.unload}
        </button>
      </div>

      <fieldset class={styles.fields} disabled={submitting()}>
        <legend class="srOnly">{props.vm.t.move}</legend>

        <FormField label={props.vm.t.container} for="container_id" error={container.error()}>
          <select
            id="container_id"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(container.error()) }}
            value={container.value()}
            onChange={(e) => props.vm.set('container_id', e.currentTarget.value)}
            onBlur={() => props.vm.blur('container_id')}
          >
            <option value="">{props.vm.t.selectContainer}</option>
            <For each={props.vm.containers}>
              {(option) => (
                <option value={option.id}>
                  {option.code} · {option.occupancyText}
                </option>
              )}
            </For>
          </select>
        </FormField>
        <Show when={props.vm.containers.length === 0}>
          <p class={styles.empty}>{props.vm.t.noContainers}</p>
        </Show>

        <FormField label={props.vm.t.product} for="product_id" error={product.error()}>
          <select
            id="product_id"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(product.error()) }}
            value={product.value()}
            onChange={(e) => props.vm.set('product_id', e.currentTarget.value)}
            onBlur={() => props.vm.blur('product_id')}
          >
            <option value="">{props.vm.t.selectProduct}</option>
            <For each={props.vm.products}>
              {(option) => (
                <option value={option.id}>
                  {option.name} · {option.riskLabel}
                </option>
              )}
            </For>
          </select>
        </FormField>
        <Show when={props.vm.products.length === 0}>
          <p class={styles.empty}>{props.vm.t.noProducts}</p>
        </Show>

        <FormField
          label={props.vm.t.quantity}
          for="quantity"
          error={quantity.error()}
          hint={props.vm.t.quantityHint}
        >
          <input
            id="quantity"
            type="number"
            step="0.0001"
            min="0"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(quantity.error()) }}
            value={quantity.value()}
            onInput={(e) => props.vm.set('quantity', e.currentTarget.value)}
            onBlur={() => props.vm.blur('quantity')}
            placeholder="1500"
          />
        </FormField>
      </fieldset>

      {/* A previsão é `aria-live`: ela muda sem que o foco saia do campo de
          quantidade, então quem não vê a tela precisa ser avisado. */}
      <div class={styles.preview} aria-live="polite">
        <span class={styles.previewLabel}>{props.vm.t.weightAfter}</span>
        <span class={styles.previewValue}>{preview() ?? '—'}</span>
      </div>

      <p class={styles.error} role="alert" hidden={!failed()}>
        {props.vm.t.submitError}
      </p>
      <p class={styles.done} role="status" hidden={!succeeded()}>
        {props.vm.t.done}
      </p>

      <button
        type="submit"
        class={styles.submit}
        classList={{ [styles.loading]: submitting() }}
        disabled={submitting() || props.vm.containers.length === 0}
      >
        <Icon name="weight" size={16} />
        {props.vm.actionLabel()}
      </button>
    </form>
  );
}
