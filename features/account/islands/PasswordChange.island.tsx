import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { type JSX } from 'solid-js';
import { changePassword } from 'tachyon-portmaster-sdk/account';

import styles from './PasswordChange.island.module.scss';
import {
  createPasswordChangeSchema,
  type PasswordChangeData,
  type PasswordChangeSchemaText,
} from '../schemas/account.schema';

import { browserClient } from '@/features/core/api/client';
import { FormField } from '@/features/core/components/FormField';
import { IslandProvider } from '@/features/core/islands/IslandProvider';
import { cn } from '@/features/core/utils/ui';
import { errText } from '@/features/core/utils/ui';

/** Texto que a troca de senha consome (contrato local). */
export interface PasswordChangeText extends PasswordChangeSchemaText {
  security: string;
  currentPassword: string;
  newPassword: string;
  submitError: string;
  passwordChanged: string;
  changePassword: string;
}

function Inner(props: { t: PasswordChangeText }): JSX.Element {
  const mutation = createMutation(() => ({
    mutationFn: (value: PasswordChangeData) => changePassword(browserClient, value),
    onSuccess: () => form.reset(),
  }));

  const form = createForm(() => ({
    defaultValues: { current_password: '', new_password: '' } as PasswordChangeData,
    validators: { onChange: createPasswordChangeSchema(props.t) },
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
        <legend class="srOnly">{props.t.security}</legend>

        <form.Field name="current_password">
          {(field) => (
            <FormField
              label={props.t.currentPassword}
              for="cur-pass"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="cur-pass"
                type="password"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="new_password">
          {(field) => (
            <FormField
              label={props.t.newPassword}
              for="new-pass"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="new-pass"
                type="password"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <p class={styles.err} role="alert" hidden={!mutation.isError}>
        {props.t.submitError}
      </p>
      <p class={styles.ok} role="status" hidden={!mutation.isSuccess}>
        {props.t.passwordChanged}
      </p>

      <button
        type="submit"
        class={cn(styles.submit, mutation.isPending && styles.loading)}
        disabled={mutation.isPending}
      >
        {props.t.changePassword}
      </button>
    </form>
  );
}

/** Troca da própria senha (island). */
export function PasswordChange(props: { t: PasswordChangeText }): JSX.Element {
  return (
    <IslandProvider>
      <Inner t={props.t} />
    </IslandProvider>
  );
}
