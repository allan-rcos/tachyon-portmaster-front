import { FormField } from '@view/core/components/FormField';
import { Icon } from '@view/core/components/Icon';
import type { LoginField, LoginVM } from '@viewmodel/auth/login-page.vm';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './LoginForm.island.module.scss';

export interface LoginFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: LoginVM;
}

/**
 * Formulário de login.
 *
 * Deixou de ser classe: não sobrou estado aqui. Valores, erros, "já tocou" e
 * "está enviando" moram no `LoginVM`; este arquivo só desenha e encaminha
 * eventos. Quem toca o navegador continua sendo a View — o ViewModel calcula o
 * destino (`vm.redirectTo`) e sinaliza sucesso, mas não navega.
 *
 * `live()` no `.value` é necessário porque o `<input>` é controlado: sem ele o
 * `lit-html` compara com o valor do último render e não corrige o DOM quando o
 * usuário digitou algo que o ViewModel normalizou.
 */
export function LoginForm(props: LoginFormProps): TemplateResult {
  const { vm } = props;

  const submit = (event: Event) => {
    event.preventDefault();
    void vm.submit().then((ok) => {
      if (ok) window.location.href = vm.redirectTo;
    });
  };

  const field = (
    name: LoginField,
    type: string,
    label: string,
    autocomplete: string,
    placeholder: string,
  ) => html`
    ${FormField({
      label,
      for: name,
      error: vm.error(name),
      children: html`<input
        id=${name}
        type=${type}
        autocomplete=${autocomplete}
        class=${classMap({ [styles.input]: true, [styles.invalid]: Boolean(vm.error(name)) })}
        .value=${live(vm.value(name))}
        placeholder=${placeholder}
        @input=${(e: Event) => vm.set(name, (e.currentTarget as HTMLInputElement).value)}
        @blur=${() => vm.blur(name)}
      />`,
    })}
  `;

  return html`<form class=${styles.form} @submit=${submit}>
    ${field('email', 'email', vm.t.email, 'email', 'ana@portmaster.test')}
    ${field('password', 'password', vm.t.password, 'current-password', '••••••••')}

    <p class=${styles.error} role="alert" ?hidden=${!vm.failed()}>${vm.t.invalid}</p>

    <button
      type="submit"
      class=${classMap({ [styles.submit]: true, [styles.loading]: vm.submitting() })}
      ?disabled=${vm.submitting()}
    >
      ${Icon({ name: 'login', size: 18 })} ${vm.t.submit}
    </button>
  </form>`;
}
