import { createForm } from '@tanstack/solid-form';
import { FormField } from '@view/core/components/FormField';
import { bindMutation } from '@view/core/observable/bind-mutation';
import type { PasswordChangeText } from '@viewmodel/account/i18n/text-contracts';
import { changeAccountPassword } from '@viewmodel/account/mutations/change-account-password.mutation';
import {
  createPasswordChangeSchema,
  type PasswordChangeData,
} from '@viewmodel/account/schemas/account.schema';
import { createMutationSignal } from '@viewmodel/core/observable/mutation-signal';
import { type JSX } from 'solid-js';

import styles from './PasswordChange.island.module.scss';

function Inner(props: PasswordChangeProps): JSX.Element {
  const mutation = bindMutation(
    createMutationSignal((value: PasswordChangeData) => changeAccountPassword(value), {
      onSuccess: () => form.reset(),
    }),
  );

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
      <fieldset class={styles.fields} disabled={mutation.isPending()}>
        <legend class="srOnly">{props.t.security}</legend>

        <form.Field name="current_password">
          {(field) => (
            <FormField
              label={props.t.currentPassword}
              for="cur-pass"
              error={field().state.meta.errors[0]?.message}
            >
              <input
                id="cur-pass"
                type="password"
                class={styles.input}
                classList={{ [styles.invalid]: field().state.meta.errors.length > 0 }}
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
              error={field().state.meta.errors[0]?.message}
            >
              <input
                id="new-pass"
                type="password"
                class={styles.input}
                classList={{ [styles.invalid]: field().state.meta.errors.length > 0 }}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <p class={styles.err} role="alert" hidden={!mutation.isError()}>
        {props.t.submitError}
      </p>
      <p class={styles.ok} role="status" hidden={!mutation.isSuccess()}>
        {props.t.passwordChanged}
      </p>

      <button
        type="submit"
        class={styles.submit}
        classList={{ [styles.loading]: mutation.isPending() }}
        disabled={mutation.isPending()}
      >
        {props.t.changePassword}
      </button>
    </form>
  );
}

export interface PasswordChangeProps {
  t: PasswordChangeText;
}

/** Troca da própria senha (island). */
export function PasswordChange(props: PasswordChangeProps): JSX.Element {
  return <Inner t={props.t} />;
}

export type { PasswordChangeText };
