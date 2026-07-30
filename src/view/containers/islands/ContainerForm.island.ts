import { FormField } from '@view/core/components/FormField';
import type { ContainerField } from '@viewmodel/containers/container-create-page.vm';
import type { ContainerFormText } from '@viewmodel/containers/i18n/text-contracts';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './ContainerForm.island.module.scss';

/**
 * O que o formulário precisa do ViewModel da rota.
 *
 * Ver `@view/products/islands/ProductForm.island` para por que o tipo mora na
 * View e não é importado pelos VMs.
 */
export interface ContainerFormVM {
  t: ContainerFormText;
  /** Destino do cancelar e da navegação após salvar. */
  listHref: string;
  mode: 'create' | 'edit';
  value: (field: ContainerField) => string;
  error: (field: ContainerField) => string | undefined;
  submitting: () => boolean;
  failed: () => boolean;
  set: (field: ContainerField, value: string) => void;
  blur: (field: ContainerField) => void;
  submit: () => Promise<boolean>;
}

export interface ContainerFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: ContainerFormVM;
}

/**
 * Formulário de criação/edição de contêiner.
 *
 * O código só é editável na criação: em edição ele vira `<output>`, porque o
 * `PATCH` não o aceita. Quem decide isso é o `mode`, e o schema aplica a mesma
 * regra do lado da validação.
 *
 * Sem estado próprio — ver `@view/products/islands/ProductForm.island`.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerForm(props: ContainerFormProps): TemplateResult {
  const { vm } = props;

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void vm.submit().then((ok) => {
      if (ok) window.location.href = vm.listHref;
    });
  };

  return html`<form class=${styles.form} @submit=${submit}>
    <fieldset class=${styles.fields} ?disabled=${vm.submitting()}>
      <legend class="srOnly">${vm.t.data}</legend>

      ${
        vm.mode === 'create'
          ? FormField({
              label: vm.t.code,
              for: 'code',
              error: vm.error('code'),
              children: html`<input
                id="code"
                class=${classMap({
                [styles.input]: true,
                [styles.invalid]: Boolean(vm.error('code')),
              })}
                .value=${live(vm.value('code'))}
                placeholder="MSKU-4410"
                @input=${(e: Event) => vm.set('code', (e.currentTarget as HTMLInputElement).value)}
                @blur=${() => vm.blur('code')}
              />`,
            })
          : FormField({
              label: vm.t.code,
              children: html`<output class=${styles.readonly}>${vm.value('code')}</output>`,
            })
      }
      ${FormField({
        label: vm.t.maxCapacity,
        for: 'max_capacity',
        error: vm.error('max_capacity'),
        children: html`<input
          id="max_capacity"
          type="number"
          min="1"
          class=${classMap({
            [styles.input]: true,
            [styles.invalid]: Boolean(vm.error('max_capacity')),
          })}
          .value=${live(vm.value('max_capacity'))}
          placeholder="28000"
          @input=${(e: Event) =>
            vm.set('max_capacity', (e.currentTarget as HTMLInputElement).value)}
          @blur=${() => vm.blur('max_capacity')}
        />`,
      })}
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

export type { ContainerFormText };
