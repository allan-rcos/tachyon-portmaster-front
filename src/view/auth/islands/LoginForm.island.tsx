import { createForm } from '@tanstack/solid-form';
import { FormField } from '@view/core/components/FormField';
import { Icon } from '@view/core/components/Icon';
import { bindMutation } from '@view/core/observable/bind-mutation';
import { cn } from '@view/core/utils/ui';
import { errText } from '@view/core/utils/ui';
import type { LoginFormText } from '@viewmodel/auth/i18n/text-contracts';
import { signIn } from '@viewmodel/auth/mutations/sign-in.mutation';
import {
  createLoginSchema,
  type LoginFormData,
} from '@viewmodel/auth/schemas/login.schema';
import { createMutationSignal } from '@viewmodel/core/observable/mutation-signal';
import { type JSX } from 'solid-js';

import styles from './LoginForm.island.module.scss';

function redirectTarget(): string {
  const to = new URLSearchParams(window.location.search).get('redirect');
  return to && to.startsWith('/') ? to : '/painel';
}

function LoginFormInner(props: { t: LoginFormText }): JSX.Element {
  const mutation = bindMutation(createMutationSignal((v: LoginFormData) => signIn(v), { onSuccess: () => {
      window.location.href = redirectTarget();
    } }));

  const form = createForm(() => ({
    defaultValues: { email: '', password: '' } as LoginFormData,
    validators: { onChange: createLoginSchema(props.t) },
    onSubmit: ({ value }) => {
      // `mutate` (não `mutateAsync`) trata o erro internamente
      // (mutation.isError()) e nunca rejeita — evita unhandled rejection.
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

      <p class={styles.error} role="alert" hidden={!mutation.isError()}>
        {props.t.invalid}
      </p>

      <button
        type="submit"
        class={cn(styles.submit, mutation.isPending() && styles.loading)}
        disabled={mutation.isPending()}
      >
        <Icon name="login" size={18} />
        {props.t.submit}
      </button>
    </form>
  );
}

/** Formulário de login (island). Autentica na API (same-origin token) e grava
 *  o cookie `auth_token`, depois recarrega para a rota destino (novo SSR). */
export function LoginForm(props: { t: LoginFormText }): JSX.Element {
  return <LoginFormInner t={props.t} />;
}

export type { LoginFormText };
