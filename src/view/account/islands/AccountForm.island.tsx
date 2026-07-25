import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { FormField } from '@view/core/components/FormField';
import { IslandProvider } from '@view/core/islands/IslandProvider';
import { cn } from '@view/core/utils/ui';
import { errText } from '@view/core/utils/ui';
import type { AccountFormText } from '@viewmodel/account/i18n/text-contracts';
import { updateAccountProfile } from '@viewmodel/account/mutations/update-account-profile.mutation';
import {
  createAccountSchema,
  type AccountFormData,
} from '@viewmodel/account/schemas/account.schema';
import { type JSX } from 'solid-js';

import styles from './AccountForm.island.module.scss';

function Inner(props: { name: string; email: string; t: AccountFormText }): JSX.Element {
  const mutation = createMutation(() => ({
    mutationFn: (value: AccountFormData) => updateAccountProfile(value),
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
export function AccountForm(props: {
  name: string;
  email: string;
  t: AccountFormText;
}): JSX.Element {
  return (
    <IslandProvider>
      <Inner {...props} />
    </IslandProvider>
  );
}

export type { AccountFormText };
