import { FormField } from '@view/core/components/FormField';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { AccountFormText } from '@viewmodel/account/i18n/text-contracts';
import type { AccountFormVM, ProfileField } from '@viewmodel/account/vm-contracts';
import { type JSX } from 'solid-js';

import styles from './AccountForm.island.module.scss';

export interface AccountFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: AccountFormVM;
}

/**
 * Formulário de dados da própria conta.
 *
 * Recarrega no sucesso, e não é ornamento: o nome aparece também no rodapé da
 * barra lateral, que é montado pelo `+Layout` a partir do `data` da rota.
 *
 * Sem estado próprio — ver `@view/products/islands/ProductForm.island`.
 *
 * @param props.vm ViewModel da rota.
 */
export function AccountForm(props: AccountFormProps): JSX.Element {
  const field = (which: ProfileField) => ({
    value: toAccessor(() => props.vm.profileValue(which)),
    error: toAccessor(() => props.vm.profileError(which)),
  });

  const name = field('name');
  const email = field('email');
  const saving = toAccessor(() => props.vm.savingProfile());
  const failed = toAccessor(() => props.vm.profileFailed());

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void props.vm.saveProfile().then((ok) => {
      if (ok) window.location.reload();
    });
  };

  return (
    <form class={styles.form} onSubmit={submit}>
      <fieldset class={styles.fields} disabled={saving()}>
        <legend class="srOnly">{props.vm.t.profile}</legend>

        <FormField label={props.vm.t.name} for="acc-name" error={name.error()}>
          <input
            id="acc-name"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(name.error()) }}
            value={name.value()}
            onInput={(e) => props.vm.setProfile('name', e.currentTarget.value)}
            onBlur={() => props.vm.blurProfile('name')}
          />
        </FormField>

        <FormField label={props.vm.t.email} for="acc-email" error={email.error()}>
          <input
            id="acc-email"
            type="email"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(email.error()) }}
            value={email.value()}
            onInput={(e) => props.vm.setProfile('email', e.currentTarget.value)}
            onBlur={() => props.vm.blurProfile('email')}
          />
        </FormField>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!failed()}>
        {props.vm.t.submitError}
      </p>

      <button
        type="submit"
        class={styles.submit}
        classList={{ [styles.loading]: saving() }}
        disabled={saving()}
      >
        {props.vm.t.save}
      </button>
    </form>
  );
}

export type { AccountFormText };
