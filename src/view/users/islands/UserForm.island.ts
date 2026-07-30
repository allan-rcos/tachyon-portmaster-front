import { FormField } from '@view/core/components/FormField';
import type { UserFormText } from '@viewmodel/users/i18n/text-contracts';
import type { UserField, UserFormVM } from '@viewmodel/users/vm-contracts';
import { html, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './UserForm.island.module.scss';

export interface UserFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: UserFormVM;
}

/**
 * Formulário de usuário: cria (com senha inicial) ou edita dados + perfis.
 *
 * A senha inicial só existe na criação — o `PATCH` não a aceita. O `mode` decide
 * se o campo aparece, e o schema aplica a mesma regra na validação.
 *
 * Sem estado próprio — ver `@view/products/islands/ProductForm.island`.
 *
 * @param props.vm ViewModel da rota.
 */
export function UserForm(props: UserFormProps): TemplateResult {
  const { vm } = props;

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void vm.submit().then((ok) => {
      if (ok) window.location.href = vm.listHref;
    });
  };

  const textField = (field: UserField, id: string, label: string, type = 'text') =>
    FormField({
      label,
      for: id,
      error: vm.error(field),
      children: html`<input
        id=${id}
        type=${type}
        class=${classMap({ [styles.input]: true, [styles.invalid]: Boolean(vm.error(field)) })}
        .value=${live(vm.value(field))}
        @input=${(e: Event) => vm.set(field, (e.currentTarget as HTMLInputElement).value)}
        @blur=${() => vm.blur(field)}
      />`,
    });

  return html`<form class=${styles.form} @submit=${submit}>
    <fieldset class=${styles.fields} ?disabled=${vm.submitting()}>
      <legend class="srOnly">${vm.t.data}</legend>

      ${textField('name', 'user-name', vm.t.name)}
      ${textField('email', 'user-email', vm.t.email, 'email')}
      ${
        vm.mode === 'create'
          ? textField('initial_password', 'user-pass', vm.t.initialPassword, 'password')
          : nothing
      }

      <fieldset class=${styles.roles}>
        <legend class=${styles.rolesLabel}>${vm.t.roles}</legend>
        ${vm.roles.map(
          (role) =>
            html`<label class=${styles.roleItem}>
              <input
                type="checkbox"
                .checked=${live(vm.hasRole(role.id))}
                @change=${(e: Event) =>
                  vm.toggleRole(role.id, (e.currentTarget as HTMLInputElement).checked)}
              />
              <span>${role.name}</span>
            </label>`,
        )}
        <p class=${styles.error} role="alert" ?hidden=${!vm.rolesError()}>${vm.rolesError()}</p>
      </fieldset>
    </fieldset>

    <p class=${styles.error} role="alert" ?hidden=${!vm.failed()}>${vm.t.submitError}</p>

    <menu class=${styles.actions}>
      <li>
        <button
          type="submit"
          class=${classMap({ [styles.submit]: true, [styles.loading]: vm.submitting() })}
          ?disabled=${vm.submitting()}
        >
          ${vm.mode === 'create' ? vm.t.create : vm.t.save}
        </button>
      </li>
      <li><a class=${styles.cancel} href=${vm.listHref}>${vm.t.cancel}</a></li>
    </menu>
  </form>`;
}

export type { UserFormText, UserFormVM };
