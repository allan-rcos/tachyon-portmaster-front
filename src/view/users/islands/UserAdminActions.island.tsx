import { FormField } from '@view/core/components/FormField';
import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { UserAdminActionsText } from '@viewmodel/users/i18n/text-contracts';
import type { UserAdminActionsVM } from '@viewmodel/users/vm-contracts';
import { type JSX } from 'solid-js';

import styles from './UserAdminActions.island.module.scss';

export interface UserAdminActionsProps {
  /** ViewModel da rota. */
  vm: UserAdminActionsVM;
}

/**
 * Ações administrativas de usuário: redefinir senha e excluir.
 *
 * Sem estado próprio. O `form.reset()` que a versão anterior chamava no sucesso
 * virou responsabilidade do ViewModel, que limpa o campo e acende
 * `resetDone()` — o mesmo `isSuccess()` de antes, só que sem embrulhar a
 * mutation num sinal genérico.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserAdminActions(props: UserAdminActionsProps): JSX.Element {
  const newPassword = toAccessor(() => props.vm.newPassword());
  const newPasswordError = toAccessor(() => props.vm.newPasswordError());
  const resetting = toAccessor(() => props.vm.resetting());
  const resetDone = toAccessor(() => props.vm.resetDone());

  const reset = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void props.vm.resetPassword();
  };

  return (
    <div class={styles.wrap}>
      <section class={styles.card}>
        <h2 class={styles.title}>{props.vm.t.resetPassword}</h2>
        <form class={styles.resetForm} onSubmit={reset}>
          <FormField label={props.vm.t.newPassword} for="reset-pass" error={newPasswordError()}>
            <input
              id="reset-pass"
              type="password"
              class={styles.input}
              classList={{ [styles.invalid]: Boolean(newPasswordError()) }}
              value={newPassword()}
              onInput={(e) => props.vm.setNewPassword(e.currentTarget.value)}
            />
          </FormField>
          <button type="submit" class={styles.resetBtn} disabled={resetting()}>
            {props.vm.t.resetPassword}
          </button>
        </form>
        <p class={styles.ok} role="status" hidden={!resetDone()}>
          {props.vm.t.passwordChanged}
        </p>
      </section>

      <section class={styles.card}>
        <h2 class={styles.title}>{props.vm.t.delete}</h2>
        <ConfirmDialog
          triggerLabel={props.vm.t.delete}
          triggerIcon="trash"
          triggerVariant="danger"
          confirmVariant="danger"
          title={props.vm.t.delete}
          message={props.vm.t.deleteConfirm}
          confirmLabel={props.vm.t.delete}
          cancelLabel={props.vm.t.cancel}
          onConfirm={props.vm.remove}
          onDone={() => {
            window.location.href = props.vm.listHref;
          }}
        />
      </section>
    </div>
  );
}

export type { UserAdminActionsText, UserAdminActionsVM };
