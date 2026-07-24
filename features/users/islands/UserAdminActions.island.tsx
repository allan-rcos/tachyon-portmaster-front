import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { type JSX } from 'solid-js';
import { resetUserPassword, deleteUser } from 'tachyon-portmaster-sdk/users';

import styles from './UserAdminActions.island.module.scss';
import { createPasswordResetSchema, type PasswordResetSchemaText } from '../schemas/user.schema';

import { browserClient } from '@/features/core/api/client';
import { FormField } from '@/features/core/components/FormField';
import { ConfirmDialog } from '@/features/core/islands/ConfirmDialog.island';
import { IslandProvider } from '@/features/core/islands/IslandProvider';
import { cn } from '@/features/core/utils/ui';
import { errText } from '@/features/core/utils/ui';

/** Texto que as ações administrativas consomem (contrato local). */
export interface UserAdminActionsText extends PasswordResetSchemaText {
  resetPassword: string;
  newPassword: string;
  passwordChanged: string;
  delete: string;
  deleteConfirm: string;
  cancel: string;
}

function Inner(props: { userId: string; t: UserAdminActionsText }): JSX.Element {
  const reset = createMutation(() => ({
    mutationFn: (value: string) =>
      resetUserPassword(browserClient, props.userId, { new_password: value }),
    onSuccess: () => form.reset(),
  }));

  const form = createForm(() => ({
    defaultValues: { new_password: '' },
    validators: { onChange: createPasswordResetSchema(props.t) },
    onSubmit: ({ value }) => reset.mutate(value.new_password),
  }));

  return (
    <div class={styles.wrap}>
      <section class={styles.card}>
        <h2 class={styles.title}>{props.t.resetPassword}</h2>
        <form
          class={styles.resetForm}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field name="new_password">
            {(field) => (
              <FormField
                label={props.t.newPassword}
                for="reset-pass"
                error={errText(field().state.meta.errors)}
              >
                <input
                  id="reset-pass"
                  type="password"
                  class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  onBlur={field().handleBlur}
                />
              </FormField>
            )}
          </form.Field>
          <button type="submit" class={styles.resetBtn} disabled={reset.isPending}>
            {props.t.resetPassword}
          </button>
        </form>
        <p class={styles.ok} role="status" hidden={!reset.isSuccess}>
          {props.t.passwordChanged}
        </p>
      </section>

      <section class={styles.card}>
        <h2 class={styles.title}>{props.t.delete}</h2>
        <ConfirmDialog
          triggerLabel={props.t.delete}
          triggerIcon="trash"
          triggerVariant="danger"
          confirmVariant="danger"
          title={props.t.delete}
          message={props.t.deleteConfirm}
          confirmLabel={props.t.delete}
          cancelLabel={props.t.cancel}
          onConfirm={() => deleteUser(browserClient, props.userId).then(() => undefined)}
          onDone={() => {
            window.location.href = '/painel/usuarios';
          }}
        />
      </section>
    </div>
  );
}

/** Ações administrativas de usuário: redefinir senha e excluir. */
export function UserAdminActions(props: { userId: string; t: UserAdminActionsText }): JSX.Element {
  return (
    <IslandProvider>
      <Inner {...props} />
    </IslandProvider>
  );
}
