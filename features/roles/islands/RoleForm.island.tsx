import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { Show, type JSX } from 'solid-js';
import type { Permission } from 'tachyon-portmaster-sdk/common';
import { createRole, updateRolePermissions } from 'tachyon-portmaster-sdk/roles';

import { PermissionMatrix } from './PermissionMatrix';
import styles from './RoleForm.island.module.scss';
import {
  createRoleSchema,
  createRolePermissionsSchema,
  type RoleSchemaText,
} from '../schemas/role.schema';

import { browserClient } from '@/features/core/api/client';
import { FormField } from '@/features/core/components/FormField';
import { IslandProvider } from '@/features/core/islands/IslandProvider';
import { cn } from '@/features/core/utils/ui';
import { errText } from '@/features/core/utils/ui';

/** Texto que o formulário de perfil consome (contrato local). */
export interface RoleFormText extends RoleSchemaText {
  name: string;
  permissions: string;
  submitError: string;
  create: string;
  save: string;
  cancel: string;
}

export interface RoleFormProps {
  mode: 'create' | 'permissions';
  t: RoleFormText;
  roleId?: string;
  defaultName?: string;
  defaultPermissions?: Permission[];
}

interface FormValues {
  name: string;
  permissions: Permission[];
}

function Inner(props: RoleFormProps): JSX.Element {
  const mutation = createMutation(() => ({
    mutationFn: (value: FormValues) => {
      if (props.mode === 'create') {
        return createRole(browserClient, { name: value.name, permissions: value.permissions });
      }
      return updateRolePermissions(browserClient, props.roleId!, {
        permissions: value.permissions,
      });
    },
    onSuccess: () => {
      window.location.href = '/painel/perfis';
    },
  }));

  const form = createForm(() => ({
    defaultValues: {
      name: props.defaultName ?? '',
      permissions: props.defaultPermissions ?? [],
    } as FormValues,
    validators: {
      onChange: (props.mode === 'create'
        ? createRoleSchema(props.t)
        : createRolePermissionsSchema(props.t)) as never,
    },
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
              error={errText(field().state.meta.errors)}
            >
              <input
                id="role-name"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
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
          <fieldset class={styles.matrixWrap} disabled={mutation.isPending}>
            <legend class={styles.matrixLabel}>{props.t.permissions}</legend>
            <PermissionMatrix
              selected={new Set(field().state.value)}
              onToggle={(perm, checked) => {
                const set = new Set(field().state.value);
                if (checked) set.add(perm);
                else set.delete(perm);
                field().handleChange([...set]);
              }}
              disabled={mutation.isPending}
            />
            <p class={styles.error} role="alert" hidden={field().state.meta.errors.length === 0}>
              {errText(field().state.meta.errors)}
            </p>
          </fieldset>
        )}
      </form.Field>

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
  return (
    <IslandProvider>
      <Inner {...props} />
    </IslandProvider>
  );
}
