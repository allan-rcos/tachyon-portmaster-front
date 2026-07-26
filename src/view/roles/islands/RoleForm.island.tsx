import { createForm } from '@tanstack/solid-form';
import { FormField } from '@view/core/components/FormField';
import { bindMutation } from '@view/core/observable/bind-mutation';
import { PermissionMatrix } from '@view/roles/components/PermissionMatrix';
import { createMutationSignal } from '@viewmodel/core/observable/mutation-signal';
import type { OptionGroup } from '@viewmodel/core/page/options';
import type { RoleFormText } from '@viewmodel/roles/i18n/text-contracts';
import { createRole } from '@viewmodel/roles/mutations/create-role.mutation';
import { updateRolePermissions } from '@viewmodel/roles/mutations/update-role-permissions.mutation';
import { createRoleSchema } from '@viewmodel/roles/schemas/role.schema';
import { Show, type JSX } from 'solid-js';

import styles from './RoleForm.island.module.scss';

export interface RoleFormProps {
  mode: 'create' | 'permissions';
  t: RoleFormText;
  /** Matriz de permissões, com rótulos já resolvidos pelo ViewModel. */
  permissionGroups: readonly OptionGroup[];
  roleId?: string;
  defaultName?: string;
  defaultPermissions?: readonly string[];
}

/** Valores do formulário. `permissions` é `string[]` porque a View não conhece
 *  o enum: quem cobra que sejam permissões válidas é o schema, na submissão. */
interface FormValues {
  name: string;
  permissions: string[];
}

function Inner(props: RoleFormProps): JSX.Element {
  const mutation = bindMutation(
    createMutationSignal(
      (value: FormValues) => {
        // O parse é quem estreita `string[]` para `Permission[]` — daqui para
        // baixo o valor já é do enum.
        const body = createRoleSchema(props.mode, props.t).parse(value);
        return props.mode === 'create'
          ? createRole(body)
          : updateRolePermissions(props.roleId!, body.permissions);
      },
      {
        onSuccess: () => {
          window.location.href = '/painel/perfis';
        },
      },
    ),
  );

  const form = createForm(() => ({
    defaultValues: {
      name: props.defaultName ?? '',
      permissions: [...(props.defaultPermissions ?? [])],
    } as FormValues,
    validators: { onChange: createRoleSchema(props.mode, props.t) },
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
      <Show
        when={props.mode === 'create'}
        fallback={
          <FormField label={props.t.name}>
            <output class={styles.readonly}>{props.defaultName}</output>
          </FormField>
        }
      >
        <form.Field name="name">
          {(field) => (
            <FormField
              label={props.t.name}
              for="role-name"
              error={field().state.meta.errors[0]?.message}
            >
              <input
                id="role-name"
                class={styles.input}
                classList={{ [styles.invalid]: field().state.meta.errors.length > 0 }}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="Operador de pátio"
              />
            </FormField>
          )}
        </form.Field>
      </Show>

      <form.Field name="permissions">
        {(field) => (
          <fieldset class={styles.matrixWrap} disabled={mutation.isPending()}>
            <legend class={styles.matrixLabel}>{props.t.permissions}</legend>
            <PermissionMatrix
              groups={props.permissionGroups}
              selected={new Set(field().state.value)}
              onToggle={(perm, checked) => {
                const set = new Set(field().state.value);
                if (checked) set.add(perm);
                else set.delete(perm);
                field().handleChange([...set]);
              }}
              disabled={mutation.isPending()}
            />
            <p class={styles.error} role="alert" hidden={field().state.meta.errors.length === 0}>
              {field().state.meta.errors[0]?.message}
            </p>
          </fieldset>
        )}
      </form.Field>

      <p class={styles.error} role="alert" hidden={!mutation.isError()}>
        {props.t.submitError}
      </p>

      <menu class={styles.actions}>
        <li>
          <button
            type="submit"
            class={styles.submit}
            classList={{ [styles.loading]: mutation.isPending() }}
            disabled={mutation.isPending()}
          >
            {props.mode === 'create' ? props.t.create : props.t.save}
          </button>
        </li>
        <li>
          <a class={styles.cancel} href="/painel/perfis">
            {props.t.cancel}
          </a>
        </li>
      </menu>
    </form>
  );
}

/** Formulário de perfil (island): cria (nome + permissões) ou
 *  sincroniza as permissões de um perfil existente. */
export function RoleForm(props: RoleFormProps): JSX.Element {
  return <Inner {...props} />;
}

export type { RoleFormText };
