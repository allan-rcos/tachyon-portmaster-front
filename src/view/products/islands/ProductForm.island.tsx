import { FormField } from '@view/core/components/FormField';
import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { ProductFormText } from '@viewmodel/products/i18n/text-contracts';
import type { ProductField, ProductFormVM } from '@viewmodel/products/vm-contracts';
import { For, Show, type JSX } from 'solid-js';

import styles from './ProductForm.island.module.scss';

export interface ProductFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: ProductFormVM;
}

/**
 * Formulário de produto — cria/edita e, em edição, exclui.
 *
 * Não tem mais estado: valores, erros, "já tocou", "está enviando" e "falhou"
 * moram no ViewModel da rota. Saíram junto o `@tanstack/solid-form` e o
 * `createMutationSignal`. Quem toca o navegador é a View: o VM sinaliza sucesso,
 * a View navega.
 *
 * Os acessores são montados UMA vez, aqui no setup, e não dentro do JSX: cada
 * `toAccessor` cria um signal e um effect, então chamá-lo numa expressão
 * rastreada os recriaria a cada reavaliação.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductForm(props: ProductFormProps): JSX.Element {
  const field = (name: ProductField) => ({
    value: toAccessor(() => props.vm.value(name)),
    error: toAccessor(() => props.vm.error(name)),
  });

  const name = field('name');
  const density = field('density');
  const riskClass = field('risk_class');

  const submitting = toAccessor(() => props.vm.submitting());
  const failed = toAccessor(() => props.vm.failed());

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    // Lido ANTES do await: depois da submissão o callback estaria fora do
    // escopo rastreado, e ler `props` de lá é justamente o que a regra
    // `solid/reactivity` existe para pegar.
    const destination = props.vm.listHref;
    void props.vm.submit().then((ok) => {
      if (ok) window.location.href = destination;
    });
  };

  return (
    <form class={styles.form} onSubmit={submit}>
      <fieldset class={styles.fields} disabled={submitting()}>
        <legend class="srOnly">{props.vm.t.data}</legend>

        <FormField label={props.vm.t.name} for="name" error={name.error()}>
          <input
            id="name"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(name.error()) }}
            value={name.value()}
            onInput={(e) => props.vm.set('name', e.currentTarget.value)}
            onBlur={() => props.vm.blur('name')}
            placeholder="Farelo de soja"
          />
        </FormField>

        <FormField label={props.vm.t.density} for="density" error={density.error()}>
          <input
            id="density"
            type="number"
            step="0.01"
            min="0"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(density.error()) }}
            value={density.value()}
            onInput={(e) => props.vm.set('density', e.currentTarget.value)}
            onBlur={() => props.vm.blur('density')}
            placeholder="0,58"
          />
        </FormField>

        <FormField label={props.vm.t.riskClass} for="risk_class">
          <select
            id="risk_class"
            class={styles.input}
            value={riskClass.value()}
            onChange={(e) => props.vm.set('risk_class', e.currentTarget.value)}
          >
            <For each={props.vm.riskOptions}>
              {(option) => <option value={option.value}>{option.label}</option>}
            </For>
          </select>
        </FormField>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!failed()}>
        {props.vm.t.submitError}
      </p>

      <menu class={styles.actions}>
        <li>
          <button
            type="submit"
            class={styles.submit}
            classList={{ [styles.loading]: submitting() }}
            disabled={submitting()}
          >
            {props.vm.mode === 'create' ? props.vm.t.create : props.vm.t.save}
          </button>
        </li>
        <li>
          <a class={styles.cancel} href={props.vm.listHref}>
            {props.vm.t.cancel}
          </a>
        </li>
        <Show when={props.vm.mode === 'edit' && props.vm.remove}>
          {(remove) => (
            <li class={styles.spacer}>
              <ConfirmDialog
                triggerLabel={props.vm.t.delete}
                triggerIcon="trash"
                triggerVariant="danger"
                confirmVariant="danger"
                title={props.vm.t.delete}
                message={props.vm.t.deleteConfirm}
                confirmLabel={props.vm.t.delete}
                cancelLabel={props.vm.t.cancel}
                onConfirm={remove()}
                onDone={() => {
                  window.location.href = props.vm.listHref;
                }}
              />
            </li>
          )}
        </Show>
      </menu>
    </form>
  );
}

export type { ProductFormText, ProductFormVM };
