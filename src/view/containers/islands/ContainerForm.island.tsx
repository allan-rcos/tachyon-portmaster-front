import { createForm } from '@tanstack/solid-form';
import { FormField } from '@view/core/components/FormField';
import { bindMutation } from '@view/core/observable/bind-mutation';
import type { ContainerFormText } from '@viewmodel/containers/i18n/text-contracts';
import { createContainer } from '@viewmodel/containers/mutations/create-container.mutation';
import { updateContainer } from '@viewmodel/containers/mutations/update-container.mutation';
import { createContainerSchema } from '@viewmodel/containers/schemas/container.schema';
import { createMutationSignal } from '@viewmodel/core/observable/mutation-signal';
import { Show, type JSX } from 'solid-js';

import styles from './ContainerForm.island.module.scss';

interface FormValues {
  code: string;
  max_capacity: string;
}

export interface ContainerFormProps {
  mode: 'create' | 'edit';
  t: ContainerFormText;
  containerId?: string;
  defaultValues?: { code: string; max_capacity: number };
}

function Inner(props: ContainerFormProps): JSX.Element {
  const mutation = bindMutation(
    createMutationSignal(
      (value: FormValues) => {
        const body = createContainerSchema(props.mode, props.t).parse(value);
        return props.mode === 'create'
          ? createContainer(body)
          : // O código não é editável: só a capacidade vai no PATCH.
            updateContainer(props.containerId!, { max_capacity: body.max_capacity });
      },
      {
        onSuccess: () => {
          window.location.href = '/painel/conteineres';
        },
      },
    ),
  );

  const form = createForm(() => ({
    defaultValues: {
      code: props.defaultValues?.code ?? '',
      max_capacity:
        props.defaultValues?.max_capacity != null ? String(props.defaultValues.max_capacity) : '',
    } as FormValues,
    validators: { onChange: createContainerSchema(props.mode, props.t) },
    onSubmit: ({ value }) => mutation.mutate(value),
  }));

  return (
    <form
      class={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <fieldset class={styles.fields} disabled={mutation.isPending()}>
        <legend class="srOnly">{props.t.data}</legend>

        <Show when={props.mode === 'create'}>
          <form.Field name="code">
            {(field) => (
              <FormField
                label={props.t.code}
                for="code"
                error={field().state.meta.errors[0]?.message}
              >
                <input
                  id="code"
                  class={styles.input}
                  classList={{ [styles.invalid]: field().state.meta.errors.length > 0 }}
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  onBlur={field().handleBlur}
                  placeholder="MSKU-4410"
                />
              </FormField>
            )}
          </form.Field>
        </Show>

        <Show when={props.mode === 'edit'}>
          <FormField label={props.t.code}>
            <output class={styles.readonly}>{props.defaultValues?.code}</output>
          </FormField>
        </Show>

        <form.Field name="max_capacity">
          {(field) => (
            <FormField
              label={props.t.maxCapacity}
              for="max_capacity"
              error={field().state.meta.errors[0]?.message}
            >
              <input
                id="max_capacity"
                type="number"
                min="1"
                class={styles.input}
                classList={{ [styles.invalid]: field().state.meta.errors.length > 0 }}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="28000"
              />
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!mutation.isError()}>
        {props.t.submitError}
      </p>

      <menu class={styles.actions}>
        <li>
          <button
            type="submit"
            class={styles.submit}
            classList={{ [styles.loading]: mutation.isPending() }}
            disabled={mutation.isPending()}
          >
            {props.mode === 'create' ? props.t.create : props.t.save}
          </button>
        </li>
        <li>
          <a class={styles.cancel} href="/painel/conteineres">
            {props.t.cancel}
          </a>
        </li>
      </menu>
    </form>
  );
}

/** Formulário de criação/edição de contêiner (island). */
export function ContainerForm(props: ContainerFormProps): JSX.Element {
  return <Inner {...props} />;
}

export type { ContainerFormText };
