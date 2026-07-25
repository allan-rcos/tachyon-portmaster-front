import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { FormField } from '@view/core/components/FormField';
import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import { IslandProvider } from '@view/core/islands/IslandProvider';
import { cn } from '@view/core/utils/ui';
import { errText } from '@view/core/utils/ui';
import type { UserAdminActionsText } from '@viewmodel/users/i18n/text-contracts';
import { deleteUser } from '@viewmodel/users/mutations/delete-user.mutation';
import { resetUserPassword } from '@viewmodel/users/mutations/reset-user-password.mutation';
import { createPasswordResetSchema } from '@viewmodel/users/schemas/user.schema';
import { type JSX } from 'solid-js';

import styles from './UserAdminActions.island.module.scss';

function Inner(props: { userId: string; t: UserAdminActionsText }): JSX.Element {
  const reset = createMutation(() => ({
    mutationFn: (value: string) => resetUserPassword(props.userId, value),
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
          onConfirm={() => deleteUser(props.userId)}
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

export type { UserAdminActionsText };
