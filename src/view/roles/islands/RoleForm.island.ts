import { FormField } from '@view/core/components/FormField';
import { PermissionMatrix } from '@view/roles/components/PermissionMatrix';
import type { OptionGroup } from '@viewmodel/core/page/options';
import type { RoleFormText } from '@viewmodel/roles/i18n/text-contracts';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './RoleForm.island.module.scss';

/**
 * O que o formulário precisa do ViewModel da rota.
 *
 * Ver `@view/products/islands/ProductForm.island` para por que o tipo mora na
 * View e não é importado pelos VMs.
 */
export interface RoleFormVM {
  t: RoleFormText;
  /** Matriz de permissões, com rótulos já resolvidos pelo ViewModel. */
  permissionGroups: readonly OptionGroup[];
  /** Destino do cancelar e da navegação após salvar. */
  listHref: string;
  mode: 'create' | 'permissions';
  name: () => string;
  nameError: () => string | undefined;
  hasPermission: (value: string) => boolean;
  permissionsError: () => string | undefined;
  submitting: () => boolean;
  failed: () => boolean;
  setName: (value: string) => void;
  blurName: () => void;
  togglePermission: (value: string, on: boolean) => void;
  submit: () => Promise<boolean>;
}

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
export function RoleForm(props: RoleFormProps): TemplateResult {
  const { vm } = props;

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void vm.submit().then((ok) => {
      if (ok) window.location.href = vm.listHref;
    });
  };

  return html`<form class=${styles.form} @submit=${submit}>
    ${
      vm.mode === 'create'
        ? FormField({
            label: vm.t.name,
            for: 'role-name',
            error: vm.nameError(),
            children: html`<input
              id="role-name"
              class=${classMap({ [styles.input]: true, [styles.invalid]: Boolean(vm.nameError()) })}
              .value=${live(vm.name())}
              placeholder="Operador de pátio"
              @input=${(e: Event) => vm.setName((e.currentTarget as HTMLInputElement).value)}
              @blur=${() => vm.blurName()}
            />`,
          })
        : FormField({
            label: vm.t.name,
            children: html`<output class=${styles.readonly}>${vm.name()}</output>`,
          })
    }

    <fieldset class=${styles.matrixWrap} ?disabled=${vm.submitting()}>
      <legend class=${styles.matrixLabel}>${vm.t.permissions}</legend>
      ${PermissionMatrix({
        groups: vm.permissionGroups,
        isSelected: vm.hasPermission,
        onToggle: vm.togglePermission,
        disabled: vm.submitting(),
      })}
      <p class=${styles.error} role="alert" ?hidden=${!vm.permissionsError()}>
        ${vm.permissionsError()}
      </p>
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

export type { RoleFormText };
