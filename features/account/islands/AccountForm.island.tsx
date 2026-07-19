import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { type JSX } from 'solid-js';

import styles from './AccountForm.island.module.scss';
import { createAccountSchema, type AccountFormData } from '../schemas/account.schema';

import { browserCall } from '@/services/clients/browser';
import { updateAccount } from '@/services/codecs/flow/v1/account';
import { FormField } from '@/shared/components/FormField';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { IslandProvider } from '@/shared/islands/IslandProvider';
import { cn } from '@/shared/utils/cn';
import { errText } from '@/shared/utils/formErrors';

function Inner(props: { name: string; email: string; t: Messages }): JSX.Element {
  const mutation = createMutation(() => ({
    mutationFn: (value: AccountFormData) => browserCall(updateAccount, { body: value }),
    onSuccess: () => window.location.reload(),
  }));

  const form = createForm(() => ({
    defaultValues: { name: props.name, email: props.email } as AccountFormData,
    validators: { onChange: createAccountSchema(props.t) },
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
        <legend class="srOnly">{props.t.profile}</legend>

        <form.Field name="name">
          {(field) => (
            <FormField
              label={props.t.name}
              for="acc-name"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="acc-name"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <FormField
              label={props.t.email}
              for="acc-email"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="acc-email"
                type="email"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!mutation.isError}>
        {props.t.submitError}
      </p>

      <button
        type="submit"
        class={cn(styles.submit, mutation.isPending && styles.loading)}
        disabled={mutation.isPending}
      >
        {props.t.save}
      </button>
    </form>
  );
}

/** Formulário de dados da própria conta (island). */
export function AccountForm(props: { name: string; email: string; t: Messages }): JSX.Element {
  return (
    <IslandProvider>
      <Inner {...props} />
    </IslandProvider>
  );
}
