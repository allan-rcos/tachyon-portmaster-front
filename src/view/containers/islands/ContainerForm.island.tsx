import { FormField } from '@view/core/components/FormField';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { ContainerFormText } from '@viewmodel/containers/i18n/text-contracts';
import type { ContainerFormVM } from '@viewmodel/containers/vm-contracts';
import { Show, type JSX } from 'solid-js';

import styles from './ContainerForm.island.module.scss';

export interface ContainerFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: ContainerFormVM;
}

/**
 * Formulário de criação/edição de contêiner.
 *
 * O código só é editável na criação: em edição ele vira `<output>`, porque o
 * `PATCH` não o aceita. Quem decide isso é o `mode`, e o schema aplica a mesma
 * regra do lado da validação.
 *
 * Sem estado próprio — ver `@view/products/islands/ProductForm.island`.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerForm(props: ContainerFormProps): JSX.Element {
  const code = {
    value: toAccessor(() => props.vm.value('code')),
    error: toAccessor(() => props.vm.error('code')),
  };
  const maxCapacity = {
    value: toAccessor(() => props.vm.value('max_capacity')),
    error: toAccessor(() => props.vm.error('max_capacity')),
  };

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

        <Show
          when={props.vm.mode === 'create'}
          fallback={
            <FormField label={props.vm.t.code}>
              <output class={styles.readonly}>{code.value()}</output>
            </FormField>
          }
        >
          <FormField label={props.vm.t.code} for="code" error={code.error()}>
            <input
              id="code"
              class={styles.input}
              classList={{ [styles.invalid]: Boolean(code.error()) }}
              value={code.value()}
              onInput={(e) => props.vm.set('code', e.currentTarget.value)}
              onBlur={() => props.vm.blur('code')}
              placeholder="MSKU-4410"
            />
          </FormField>
        </Show>

        <FormField label={props.vm.t.maxCapacity} for="max_capacity" error={maxCapacity.error()}>
          <input
            id="max_capacity"
            type="number"
            min="1"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(maxCapacity.error()) }}
            value={maxCapacity.value()}
            onInput={(e) => props.vm.set('max_capacity', e.currentTarget.value)}
            onBlur={() => props.vm.blur('max_capacity')}
            placeholder="28000"
          />
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
      </menu>
    </form>
  );
}

export type { ContainerFormText, ContainerFormVM };
