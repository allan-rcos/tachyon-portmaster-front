import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { FormField } from '@view/core/components/FormField';
import { zodValidator } from '@view/core/forms/zod-adapter';
import { IslandProvider } from '@view/core/islands/IslandProvider';
import { cn } from '@view/core/utils/ui';
import { errText } from '@view/core/utils/ui';
import type { ContainerFormText } from '@viewmodel/containers/i18n/text-contracts';
import { createContainer } from '@viewmodel/containers/mutations/create-container.mutation';
import { updateContainer } from '@viewmodel/containers/mutations/update-container.mutation';
import {
  createContainerCreateSchema,
  createContainerUpdateSchema,
} from '@viewmodel/containers/schemas/container.schema';
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
  const mutation = createMutation(() => ({
    mutationFn: (value: FormValues) => {
      if (props.mode === 'create') {
        const body = createContainerCreateSchema(props.t).parse(value);
        return createContainer(body);
      }
      const body = createContainerUpdateSchema(props.t).parse(value);
      return updateContainer(props.containerId!, body);
    },
    onSuccess: () => {
      window.location.href = '/painel/conteineres';
    },
  }));

  const form = createForm(() => ({
    defaultValues: {
      code: props.defaultValues?.code ?? '',
      max_capacity:
        props.defaultValues?.max_capacity != null ? String(props.defaultValues.max_capacity) : '',
    } as FormValues,
    validators: {
      onChange: zodValidator<FormValues>(
        props.mode === 'create'
          ? createContainerCreateSchema(props.t)
          : createContainerUpdateSchema(props.t),
      ),
    },
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
      <fieldset class={styles.fields} disabled={mutation.isPending}>
        <legend class="srOnly">{props.t.data}</legend>

        <Show when={props.mode === 'create'}>
          <form.Field name="code">
            {(field) => (
              <FormField label={props.t.code} for="code" error={errText(field().state.meta.errors)}>
                <input
                  id="code"
                  class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
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
              error={errText(field().state.meta.errors)}
            >
              <input
                id="max_capacity"
                type="number"
                min="1"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="28000"
              />
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!mutation.isError}>
        {props.t.submitError}
      </p>

      <menu class={styles.actions}>
        <li>
          <button
            type="submit"
            class={cn(styles.submit, mutation.isPending && styles.loading)}
            disabled={mutation.isPending}
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
  return (
    <IslandProvider>
      <Inner {...props} />
    </IslandProvider>
  );
}

export type { ContainerFormText };
