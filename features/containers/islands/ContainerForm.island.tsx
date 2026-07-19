import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { Show, type JSX } from 'solid-js';

import styles from './ContainerForm.island.module.scss';
import {
  createContainerCreateSchema,
  createContainerUpdateSchema,
} from '../schemas/container.schema';

import { browserCall } from '@/services/clients/browser';
import { createContainer, updateContainer } from '@/services/codecs/flow/v1/container';
import { FormField } from '@/shared/components/FormField';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { IslandProvider } from '@/shared/islands/IslandProvider';
import { cn } from '@/shared/utils/cn';
import { errText } from '@/shared/utils/formErrors';

interface FormValues {
  code: string;
  max_capacity: string;
}

export interface ContainerFormProps {
  mode: 'create' | 'edit';
  t: Messages;
  containerId?: string;
  defaultValues?: { code: string; max_capacity: number };
}

function Inner(props: ContainerFormProps): JSX.Element {
  const mutation = createMutation(() => ({
    mutationFn: (value: FormValues) => {
      if (props.mode === 'create') {
        const body = createContainerCreateSchema(props.t).parse(value);
        return browserCall(createContainer, { body });
      }
      const body = createContainerUpdateSchema(props.t).parse(value);
      return browserCall(updateContainer, { params: { id: props.containerId! }, body });
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
    // `as never`: o input do zod com z.coerce é `unknown` e o schema de
    // edição é parcial — o Standard-Schema do TanStack Form não casa com
    // FormValues no nível de tipo, mas a validação em runtime é correta.
    validators: {
      onChange: (props.mode === 'create'
        ? createContainerCreateSchema(props.t)
        : createContainerUpdateSchema(props.t)) as never,
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
