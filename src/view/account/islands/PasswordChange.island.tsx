import { FormField } from '@view/core/components/FormField';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { PasswordChangeText } from '@viewmodel/account/i18n/text-contracts';
import type { PasswordChangeVM, PasswordField } from '@viewmodel/account/vm-contracts';
import { type JSX } from 'solid-js';

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
export function PasswordChange(props: PasswordChangeProps): JSX.Element {
  const field = (which: PasswordField) => ({
    value: toAccessor(() => props.vm.passwordValue(which)),
    error: toAccessor(() => props.vm.passwordError(which)),
  });

  const current = field('current_password');
  const next = field('new_password');
  const changing = toAccessor(() => props.vm.changingPassword());
  const failed = toAccessor(() => props.vm.passwordFailed());
  const changed = toAccessor(() => props.vm.passwordChanged());

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void props.vm.changePassword();
  };

  return (
    <form class={styles.form} onSubmit={submit}>
      <fieldset class={styles.fields} disabled={changing()}>
        <legend class="srOnly">{props.vm.t.security}</legend>

        <FormField label={props.vm.t.currentPassword} for="cur-pass" error={current.error()}>
          <input
            id="cur-pass"
            type="password"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(current.error()) }}
            value={current.value()}
            onInput={(e) => props.vm.setPassword('current_password', e.currentTarget.value)}
            onBlur={() => props.vm.blurPassword('current_password')}
          />
        </FormField>

        <FormField label={props.vm.t.newPassword} for="new-pass" error={next.error()}>
          <input
            id="new-pass"
            type="password"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(next.error()) }}
            value={next.value()}
            onInput={(e) => props.vm.setPassword('new_password', e.currentTarget.value)}
            onBlur={() => props.vm.blurPassword('new_password')}
          />
        </FormField>
      </fieldset>

      <p class={styles.err} role="alert" hidden={!failed()}>
        {props.vm.t.submitError}
      </p>
      <p class={styles.ok} role="status" hidden={!changed()}>
        {props.vm.t.passwordChanged}
      </p>

      <button
        type="submit"
        class={styles.submit}
        classList={{ [styles.loading]: changing() }}
        disabled={changing()}
      >
        {props.vm.t.changePassword}
      </button>
    </form>
  );
}

export type { PasswordChangeText };
