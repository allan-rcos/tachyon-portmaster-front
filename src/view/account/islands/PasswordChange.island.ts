import { FormField } from '@view/core/components/FormField';
import type { PasswordChangeText } from '@viewmodel/account/i18n/text-contracts';
import type { PasswordChangeVM, PasswordField } from '@viewmodel/account/vm-contracts';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './PasswordChange.island.module.scss';

export interface PasswordChangeProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: PasswordChangeVM;
}

/**
 * Troca da própria senha.
 *
 * NÃO recarrega no sucesso, ao contrário do formulário de dados: nada visível
 * fora deste cartão muda. O `form.reset()` de antes virou trabalho do VM, que
 * limpa os campos e acende `passwordChanged()`.
 *
 * Sem estado próprio — ver `@view/products/islands/ProductForm.island`.
 *
 * @param props.vm ViewModel da rota.
 */
export function PasswordChange(props: PasswordChangeProps): TemplateResult {
  const { vm } = props;

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void vm.changePassword();
  };

  const field = (name: PasswordField, id: string, label: string) =>
    FormField({
      label,
      for: id,
      error: vm.passwordError(name),
      children: html`<input
        id=${id}
        type="password"
        class=${classMap({
          [styles.input]: true,
          [styles.invalid]: Boolean(vm.passwordError(name)),
        })}
        .value=${live(vm.passwordValue(name))}
        @input=${(e: Event) => vm.setPassword(name, (e.currentTarget as HTMLInputElement).value)}
        @blur=${() => vm.blurPassword(name)}
      />`,
    });

  return html`<form class=${styles.form} @submit=${submit}>
    <fieldset class=${styles.fields} ?disabled=${vm.changingPassword()}>
      <legend class="srOnly">${vm.t.security}</legend>
      ${field('current_password', 'cur-pass', vm.t.currentPassword)}
      ${field('new_password', 'new-pass', vm.t.newPassword)}
    </fieldset>

    <p class=${styles.err} role="alert" ?hidden=${!vm.passwordFailed()}>${vm.t.submitError}</p>
    <p class=${styles.ok} role="status" ?hidden=${!vm.passwordChanged()}>${vm.t.passwordChanged}</p>

    <button
      type="submit"
      class=${classMap({ [styles.submit]: true, [styles.loading]: vm.changingPassword() })}
      ?disabled=${vm.changingPassword()}
    >
      ${vm.t.changePassword}
    </button>
  </form>`;
}

export type { PasswordChangeText };
