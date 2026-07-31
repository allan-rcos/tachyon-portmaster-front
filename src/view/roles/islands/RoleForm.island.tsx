import { FormField } from '@view/core/components/FormField';
import { toAccessor } from '@view/core/observable/to-accessor';
import { PermissionMatrix } from '@view/roles/components/PermissionMatrix';
import type { RoleFormText } from '@viewmodel/roles/i18n/text-contracts';
import type { RoleFormVM } from '@viewmodel/roles/vm-contracts';
import { Show, type JSX } from 'solid-js';

import styles from './RoleForm.island.module.scss';

export interface RoleFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: RoleFormVM;
}

/**
 * Formulário de perfil: cria (nome + permissões) ou sincroniza as permissões de
 * um perfil existente.
 *
 * O nome só é editável na criação — o `PUT` de permissões não o aceita. O `mode`
 * decide se ele é campo ou `<output>`, e o schema aplica a mesma regra na
 * validação.
 *
 * Sem estado próprio — ver `@view/products/islands/ProductForm.island`.
 *
 * @param props.vm ViewModel da rota.
 */
export function RoleForm(props: RoleFormProps): JSX.Element {
  const name = toAccessor(() => props.vm.name());
  const nameError = toAccessor(() => props.vm.nameError());
  const permissionsError = toAccessor(() => props.vm.permissionsError());
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
      <Show
        when={props.vm.mode === 'create'}
        fallback={
          <FormField label={props.vm.t.name}>
            <output class={styles.readonly}>{name()}</output>
          </FormField>
        }
      >
        <FormField label={props.vm.t.name} for="role-name" error={nameError()}>
          <input
            id="role-name"
            class={styles.input}
            classList={{ [styles.invalid]: Boolean(nameError()) }}
            value={name()}
            onInput={(e) => props.vm.setName(e.currentTarget.value)}
            onBlur={() => props.vm.blurName()}
            placeholder="Operador de pátio"
          />
        </FormField>
      </Show>

      <fieldset class={styles.matrixWrap} disabled={submitting()}>
        <legend class={styles.matrixLabel}>{props.vm.t.permissions}</legend>
        <PermissionMatrix
          groups={props.vm.permissionGroups}
          isSelected={props.vm.hasPermission}
          onToggle={props.vm.togglePermission}
          disabled={submitting()}
        />
        <p class={styles.error} role="alert" hidden={!permissionsError()}>
          {permissionsError()}
        </p>
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

export type { RoleFormText, RoleFormVM };
