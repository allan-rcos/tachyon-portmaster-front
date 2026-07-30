import { FormField } from '@view/core/components/FormField';
import type { AccountFormText } from '@viewmodel/account/i18n/text-contracts';
import type { AccountFormVM, ProfileField } from '@viewmodel/account/vm-contracts';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

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
export function AccountForm(props: AccountFormProps): TemplateResult {
  const { vm } = props;

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void vm.saveProfile().then((ok) => {
      if (ok) window.location.reload();
    });
  };

  const field = (name: ProfileField, id: string, label: string, type = 'text') =>
    FormField({
      label,
      for: id,
      error: vm.profileError(name),
      children: html`<input
        id=${id}
        type=${type}
        class=${classMap({
          [styles.input]: true,
          [styles.invalid]: Boolean(vm.profileError(name)),
        })}
        .value=${live(vm.profileValue(name))}
        @input=${(e: Event) => vm.setProfile(name, (e.currentTarget as HTMLInputElement).value)}
        @blur=${() => vm.blurProfile(name)}
      />`,
    });

  return html`<form class=${styles.form} @submit=${submit}>
    <fieldset class=${styles.fields} ?disabled=${vm.savingProfile()}>
      <legend class="srOnly">${vm.t.profile}</legend>
      ${field('name', 'acc-name', vm.t.name)} ${field('email', 'acc-email', vm.t.email, 'email')}
    </fieldset>

    <p class=${styles.error} role="alert" ?hidden=${!vm.profileFailed()}>${vm.t.submitError}</p>

    <button
      type="submit"
      class=${classMap({ [styles.submit]: true, [styles.loading]: vm.savingProfile() })}
      ?disabled=${vm.savingProfile()}
    >
      ${vm.t.save}
    </button>
  </form>`;
}

export type { AccountFormText };
