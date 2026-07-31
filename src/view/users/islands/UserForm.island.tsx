import { FormField } from '@view/core/components/FormField';
import { toAccessor } from '@view/core/observable/to-accessor';
import type { UserFormText } from '@viewmodel/users/i18n/text-contracts';
import type { UserField, UserFormVM } from '@viewmodel/users/vm-contracts';
import { For, Show, type JSX } from 'solid-js';

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
export function UserForm(props: UserFormProps): JSX.Element {
  const field = (name: UserField) => ({
    value: toAccessor(() => props.vm.value(name)),
    error: toAccessor(() => props.vm.error(name)),
  });

  const name = field('name');
  const email = field('email');
  const initialPassword = field('initial_password');

  const rolesError = toAccessor(() => props.vm.rolesError());
  const submitting = toAccessor(() => props.vm.submitting());
  const failed = toAccessor(() => props.vm.failed());

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    // Lido ANTES do await: depois da submissão o callback estaria fora do
    // escopo rastreado, e ler `props` de lá é justamente o que a regra
    // `solid/reactivity` existe para pegar.
    const destination = props.vm.listHref;
    void props.vm.submit().then((ok) => {
      if (ok) window.location.href = destination;
    });
  };

  return (
    <form class={styles.form} onSubmit={submit}>
      <fieldset class={styles.fields} disabled={submitting()}>
        <legend class="srOnly">{props.vm.t.data}</legend>

        <FormField label={props.vm.t.name} for="user-name" error={name.error()}>
          <input
            id="user-name"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(name.error()) }}
            value={name.value()}
            onInput={(e) => props.vm.set('name', e.currentTarget.value)}
            onBlur={() => props.vm.blur('name')}
          />
        </FormField>

        <FormField label={props.vm.t.email} for="user-email" error={email.error()}>
          <input
            id="user-email"
            type="email"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(email.error()) }}
            value={email.value()}
            onInput={(e) => props.vm.set('email', e.currentTarget.value)}
            onBlur={() => props.vm.blur('email')}
          />
        </FormField>

        <Show when={props.vm.mode === 'create'}>
          <FormField
            label={props.vm.t.initialPassword}
            for="user-pass"
            error={initialPassword.error()}
          >
            <input
              id="user-pass"
              type="password"
              class={styles.input}
              classList={{ [styles.invalid]: Boolean(initialPassword.error()) }}
              value={initialPassword.value()}
              onInput={(e) => props.vm.set('initial_password', e.currentTarget.value)}
              onBlur={() => props.vm.blur('initial_password')}
            />
          </FormField>
        </Show>

        <fieldset class={styles.roles}>
          <legend class={styles.rolesLabel}>{props.vm.t.roles}</legend>
          <For each={props.vm.roles}>
            {(role) => {
              const checked = toAccessor(() => props.vm.hasRole(role.id));
              return (
                <label class={styles.roleItem}>
                  <input
                    type="checkbox"
                    checked={checked()}
                    onChange={(e) => props.vm.toggleRole(role.id, e.currentTarget.checked)}
                  />
                  <span>{role.name}</span>
                </label>
              );
            }}
          </For>
          <p class={styles.error} role="alert" hidden={!rolesError()}>
            {rolesError()}
          </p>
        </fieldset>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!failed()}>
        {props.vm.t.submitError}
      </p>

      <menu class={styles.actions}>
        <li>
          <button
            type="submit"
            class={styles.submit}
            classList={{ [styles.loading]: submitting() }}
            disabled={submitting()}
          >
            {props.vm.mode === 'create' ? props.vm.t.create : props.vm.t.save}
          </button>
        </li>
        <li>
          <a class={styles.cancel} href={props.vm.listHref}>
            {props.vm.t.cancel}
          </a>
        </li>
      </menu>
    </form>
  );
}

export type { UserFormText, UserFormVM };
