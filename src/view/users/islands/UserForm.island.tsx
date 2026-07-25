import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { FormField } from '@view/core/components/FormField';
import { zodValidator } from '@view/core/forms/zod-adapter';
import { IslandProvider } from '@view/core/islands/IslandProvider';
import { cn } from '@view/core/utils/ui';
import { errText } from '@view/core/utils/ui';
import type { UserFormText } from '@viewmodel/users/i18n/text-contracts';
import { createUser } from '@viewmodel/users/mutations/create-user.mutation';
import { updateUser } from '@viewmodel/users/mutations/update-user.mutation';
import {
  createUserCreateSchema,
  createUserUpdateSchema,
} from '@viewmodel/users/schemas/user.schema';
import { For, Show, type JSX } from 'solid-js';

import styles from './UserForm.island.module.scss';

export interface RoleOption {
  id: string;
  name: string;
}

export interface UserFormProps {
  mode: 'create' | 'edit';
  t: UserFormText;
  roles: RoleOption[];
  userId?: string;
  defaultValues?: { name: string; email: string; role_ids: string[] };
}

interface FormValues {
  name: string;
  email: string;
  initial_password: string;
  role_ids: string[];
}

function Inner(props: UserFormProps): JSX.Element {
  const schema = () =>
    props.mode === 'create' ? createUserCreateSchema(props.t) : createUserUpdateSchema(props.t);

  const mutation = createMutation(() => ({
    mutationFn: async (value: FormValues) => {
      if (props.mode === 'create') {
        return createUser({
          name: value.name,
          email: value.email,
          initial_password: value.initial_password,
          role_ids: value.role_ids,
        });
      }
      return updateUser(props.userId!, {
        name: value.name,
        email: value.email,
        role_ids: value.role_ids,
      });
    },
    onSuccess: () => {
      window.location.href = '/painel/usuarios';
    },
  }));

  const form = createForm(() => ({
    defaultValues: {
      name: props.defaultValues?.name ?? '',
      email: props.defaultValues?.email ?? '',
      initial_password: '',
      role_ids: props.defaultValues?.role_ids ?? [],
    } as FormValues,
    validators: { onChange: zodValidator<FormValues>(schema()) },
    onSubmit: ({ value }) => mutation.mutate(value),
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
      <fieldset class={styles.fields} disabled={mutation.isPending}>
        <legend class="srOnly">{props.t.data}</legend>

        <form.Field name="name">
          {(field) => (
            <FormField
              label={props.t.name}
              for="user-name"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="user-name"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <FormField
              label={props.t.email}
              for="user-email"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="user-email"
                type="email"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <Show when={props.mode === 'create'}>
          <form.Field name="initial_password">
            {(field) => (
              <FormField
                label={props.t.initialPassword}
                for="user-pass"
                error={errText(field().state.meta.errors)}
              >
                <input
                  id="user-pass"
                  type="password"
                  class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                  value={field().state.value}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  onBlur={field().handleBlur}
                />
              </FormField>
            )}
          </form.Field>
        </Show>

        <form.Field name="role_ids">
          {(field) => (
            <fieldset class={styles.roles}>
              <legend class={styles.rolesLabel}>{props.t.roles}</legend>
              <For each={props.roles}>
                {(role) => (
                  <label class={styles.roleItem}>
                    <input
                      type="checkbox"
                      checked={field().state.value.includes(role.id)}
                      onChange={(e) => {
                        const set = new Set(field().state.value);
                        if (e.currentTarget.checked) set.add(role.id);
                        else set.delete(role.id);
                        field().handleChange([...set]);
                      }}
                    />
                    <span>{role.name}</span>
                  </label>
                )}
              </For>
              <p class={styles.error} role="alert" hidden={field().state.meta.errors.length === 0}>
                {errText(field().state.meta.errors)}
              </p>
            </fieldset>
          )}
        </form.Field>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!mutation.isError}>
        {props.t.submitError}
      </p>

      <menu class={styles.actions}>
        <li>
          <button
            type="submit"
            class={cn(styles.submit, mutation.isPending && styles.loading)}
            disabled={mutation.isPending}
          >
            {props.mode === 'create' ? props.t.create : props.t.save}
          </button>
        </li>
        <li>
          <a class={styles.cancel} href="/painel/usuarios">
            {props.t.cancel}
          </a>
        </li>
      </menu>
    </form>
  );
}

/** Formulário de usuário (island): cria (com senha inicial) ou edita
 *  dados + perfis (updateUser + updateUserRoles). */
export function UserForm(props: UserFormProps): JSX.Element {
  return (
    <IslandProvider>
      <Inner {...props} />
    </IslandProvider>
  );
}

export type { UserFormText };
