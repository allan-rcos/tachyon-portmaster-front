import { FormField } from '@view/core/components/FormField';
import { Icon } from '@view/core/components/Icon';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { LoginFormText } from '@viewmodel/auth/i18n/text-contracts';
import type { LoginVM } from '@viewmodel/auth/login-page.vm';
import { type JSX } from 'solid-js';

import styles from './LoginForm.island.module.scss';

export interface LoginFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: LoginVM;
}

/**
 * Formulário de login.
 *
 * Não sobrou estado aqui: valores, erros, "já tocou" e "está enviando" moram no
 * `LoginVM`; este arquivo só desenha e encaminha eventos. Quem toca o navegador
 * continua sendo a View — o ViewModel calcula o destino (`vm.redirectTo`) e
 * sinaliza sucesso, mas não navega.
 *
 * @param props.vm ViewModel da rota.
 */
export function LoginForm(props: LoginFormProps): JSX.Element {
  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    // Lido ANTES do await: depois da submissão o callback estaria fora do
    // escopo rastreado, e ler `props` de lá é justamente o que a regra
    // `solid/reactivity` existe para pegar.
    const destination = props.vm.redirectTo;
    void props.vm.submit().then((ok) => {
      if (ok) window.location.href = destination;
    });
  };

  const email = {
    value: toAccessor(() => props.vm.value('email')),
    error: toAccessor(() => props.vm.error('email')),
  };
  const password = {
    value: toAccessor(() => props.vm.value('password')),
    error: toAccessor(() => props.vm.error('password')),
  };

  const submitting = toAccessor(() => props.vm.submitting());
  const failed = toAccessor(() => props.vm.failed());

  return (
    <form class={styles.form} onSubmit={submit}>
      <FormField label={props.vm.t.email} for="email" error={email.error()}>
        <input
          id="email"
          type="email"
          autocomplete="email"
          class={styles.input}
          classList={{ [styles.invalid]: Boolean(email.error()) }}
          value={email.value()}
          onInput={(e) => props.vm.set('email', e.currentTarget.value)}
          onBlur={() => props.vm.blur('email')}
          placeholder="ana@portmaster.test"
        />
      </FormField>

      <FormField label={props.vm.t.password} for="password" error={password.error()}>
        <input
          id="password"
          type="password"
          autocomplete="current-password"
          class={styles.input}
          classList={{ [styles.invalid]: Boolean(password.error()) }}
          value={password.value()}
          onInput={(e) => props.vm.set('password', e.currentTarget.value)}
          onBlur={() => props.vm.blur('password')}
          placeholder="••••••••"
        />
      </FormField>

      <p class={styles.error} role="alert" hidden={!failed()}>
        {props.vm.t.invalid}
      </p>

      <button
        type="submit"
        class={styles.submit}
        classList={{ [styles.loading]: submitting() }}
        disabled={submitting()}
      >
        <Icon name="login" size={18} />
        {props.vm.t.submit}
      </button>
    </form>
  );
}

export type { LoginFormText };
