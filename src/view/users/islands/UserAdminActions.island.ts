import { FormField } from '@view/core/components/FormField';
import { island } from '@view/core/island/mount';
import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import type { UserAdminActionsText } from '@viewmodel/users/i18n/text-contracts';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './UserAdminActions.island.module.scss';

/** O que as ações administrativas precisam do ViewModel da rota. */
export interface UserAdminActionsVM {
  t: UserAdminActionsText;
  /** Destino depois de excluir. */
  listHref: string;
  newPassword: () => string;
  newPasswordError: () => string | undefined;
  resetting: () => boolean;
  resetDone: () => boolean;
  setNewPassword: (value: string) => void;
  resetPassword: () => Promise<boolean>;
  remove: () => Promise<void>;
}

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
export function UserAdminActions(props: UserAdminActionsProps): TemplateResult {
  const { vm } = props;

  const reset = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void vm.resetPassword();
  };

  return html`<div class=${styles.wrap}>
    <section class=${styles.card}>
      <h2 class=${styles.title}>${vm.t.resetPassword}</h2>
      <form class=${styles.resetForm} @submit=${reset}>
        ${FormField({
          label: vm.t.newPassword,
          for: 'reset-pass',
          error: vm.newPasswordError(),
          children: html`<input
            id="reset-pass"
            type="password"
            class=${classMap({
              [styles.input]: true,
              [styles.invalid]: Boolean(vm.newPasswordError()),
            })}
            .value=${live(vm.newPassword())}
            @input=${(e: Event) => vm.setNewPassword((e.currentTarget as HTMLInputElement).value)}
          />`,
        })}
        <button type="submit" class=${styles.resetBtn} ?disabled=${vm.resetting()}>
          ${vm.t.resetPassword}
        </button>
      </form>
      <p class=${styles.ok} role="status" ?hidden=${!vm.resetDone()}>${vm.t.passwordChanged}</p>
    </section>

    <section class=${styles.card}>
      <h2 class=${styles.title}>${vm.t.delete}</h2>
      ${island(ConfirmDialog, {
        triggerLabel: vm.t.delete,
        triggerIcon: 'trash',
        triggerVariant: 'danger',
        confirmVariant: 'danger',
        title: vm.t.delete,
        message: vm.t.deleteConfirm,
        confirmLabel: vm.t.delete,
        cancelLabel: vm.t.cancel,
        onConfirm: vm.remove,
        onDone: () => {
          window.location.href = vm.listHref;
        },
      })}
    </section>
  </div>`;
}

export type { UserAdminActionsText };
