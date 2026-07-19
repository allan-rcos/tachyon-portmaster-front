import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { type JSX } from 'solid-js';

import styles from './LoginForm.island.module.scss';
import { createLoginSchema, type LoginFormData } from '../schemas/login.schema';

import { browserCall } from '@/services/clients/browser';
import { login } from '@/services/codecs/flow/v1/auth';
import { FormField } from '@/shared/components/FormField';
import { Icon } from '@/shared/components/Icon';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { IslandProvider } from '@/shared/islands/IslandProvider';
import { cn } from '@/shared/utils/cn';
import { setCookie } from '@/shared/utils/cookies';
import { errText } from '@/shared/utils/formErrors';

function redirectTarget(): string {
  const to = new URLSearchParams(window.location.search).get('redirect');
  return to && to.startsWith('/') ? to : '/painel';
}

function LoginFormInner(props: { t: Messages }): JSX.Element {
  const mutation = createMutation(() => ({
    mutationFn: (v: LoginFormData) => browserCall(login, { body: v }),
    onSuccess: (res) => {
      setCookie('auth_token', res.token);
      window.location.href = redirectTarget();
    },
  }));

  const form = createForm(() => ({
    defaultValues: { email: '', password: '' } as LoginFormData,
    validators: { onChange: createLoginSchema(props.t) },
    onSubmit: ({ value }) => {
      // `mutate` (não `mutateAsync`) trata o erro internamente
      // (mutation.isError) e nunca rejeita — evita unhandled rejection.
      mutation.mutate(value);
    },
  }));

  return (
    <form
      class={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <FormField label={props.t.email} for="email" error={errText(field().state.meta.errors)}>
            <input
              id="email"
              type="email"
              autocomplete="email"
              class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={field().handleBlur}
              placeholder="ana@portmaster.test"
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <FormField
            label={props.t.password}
            for="password"
            error={errText(field().state.meta.errors)}
          >
            <input
              id="password"
              type="password"
              autocomplete="current-password"
              class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={field().handleBlur}
              placeholder="••••••••"
            />
          </FormField>
        )}
      </form.Field>

      <p class={styles.error} role="alert" hidden={!mutation.isError}>
        {props.t.invalid}
      </p>

      <button
        type="submit"
        class={cn(styles.submit, mutation.isPending && styles.loading)}
        disabled={mutation.isPending}
      >
        <Icon name="login" size={18} />
        {props.t.submit}
      </button>
    </form>
  );
}

/** Formulário de login (island). Autentica na API (same-origin token) e grava
 *  o cookie `auth_token`, depois recarrega para a rota destino (novo SSR). */
export function LoginForm(props: { t: Messages }): JSX.Element {
  return (
    <IslandProvider>
      <LoginFormInner t={props.t} />
    </IslandProvider>
  );
}
