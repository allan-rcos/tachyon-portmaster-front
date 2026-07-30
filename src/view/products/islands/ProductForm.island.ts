import { FormField } from '@view/core/components/FormField';
import { island } from '@view/core/island/mount';
import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import type { SelectOption } from '@viewmodel/core/page/options';
import type { ProductFormText } from '@viewmodel/products/i18n/text-contracts';
import type { ProductField } from '@viewmodel/products/product-create-page.vm';
import { html, nothing, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import styles from './ProductForm.island.module.scss';

/**
 * O que o formulário precisa do ViewModel da rota.
 *
 * Declarado aqui porque é a View que descreve o que desenha; os dois VMs que o
 * satisfazem (`ProductCreateVM` e `ProductEditVM`) não importam este tipo — o
 * casamento é estrutural, então a dependência continua indo só num sentido.
 */
export interface ProductFormVM {
  t: ProductFormText;
  /** Destino do cancelar e da navegação após salvar. */
  listHref: string;
  riskOptions: readonly SelectOption[];
  mode: 'create' | 'edit';
  value: (field: ProductField) => string;
  error: (field: ProductField) => string | undefined;
  submitting: () => boolean;
  failed: () => boolean;
  set: (field: ProductField, value: string) => void;
  blur: (field: ProductField) => void;
  submit: () => Promise<boolean>;
  /** Só em edição. */
  remove?: () => Promise<void>;
}

export interface ProductFormProps {
  /** ViewModel da rota — dono do estado do formulário. */
  vm: ProductFormVM;
}

/**
 * Formulário de produto — cria/edita e, em edição, exclui.
 *
 * Não é mais classe nem tem estado: valores, erros, "já tocou", "está enviando"
 * e "falhou" moram no ViewModel da rota. Saíram junto o `@tanstack/solid-form` e
 * o `createMutationSignal`. Quem toca o navegador é a View: o VM sinaliza
 * sucesso, a View navega.
 *
 * `live()` no `.value` é necessário porque o `<input>` é controlado — sem ele o
 * `lit-html` compara com o valor do último render e não corrige o DOM quando o
 * ViewModel normaliza o que foi digitado.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductForm(props: ProductFormProps): TemplateResult {
  const { vm } = props;

  const submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void vm.submit().then((ok) => {
      if (ok) window.location.href = vm.listHref;
    });
  };

  const inputClass = (field: ProductField) =>
    classMap({ [styles.input]: true, [styles.invalid]: Boolean(vm.error(field)) });

  const onInput = (field: ProductField) => (e: Event) =>
    vm.set(field, (e.currentTarget as HTMLInputElement).value);

  return html`<form class=${styles.form} @submit=${submit}>
    <fieldset class=${styles.fields} ?disabled=${vm.submitting()}>
      <legend class="srOnly">${vm.t.data}</legend>

      ${FormField({
        label: vm.t.name,
        for: 'name',
        error: vm.error('name'),
        children: html`<input
          id="name"
          class=${inputClass('name')}
          .value=${live(vm.value('name'))}
          placeholder="Farelo de soja"
          @input=${onInput('name')}
          @blur=${() => vm.blur('name')}
        />`,
      })}
      ${FormField({
        label: vm.t.density,
        for: 'density',
        error: vm.error('density'),
        children: html`<input
          id="density"
          type="number"
          step="0.01"
          min="0"
          class=${inputClass('density')}
          .value=${live(vm.value('density'))}
          placeholder="0,58"
          @input=${onInput('density')}
          @blur=${() => vm.blur('density')}
        />`,
      })}
      ${FormField({
        label: vm.t.riskClass,
        for: 'risk_class',
        children: html`<select
          id="risk_class"
          class=${styles.input}
          .value=${live(vm.value('risk_class'))}
          @change=${(e: Event) =>
            vm.set('risk_class', (e.currentTarget as HTMLSelectElement).value)}
        >
          ${vm.riskOptions.map(
            (option) => html`<option value=${option.value}>${option.label}</option>`,
          )}
        </select>`,
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
      ${
        vm.mode === 'edit' && vm.remove
          ? html`<li class=${styles.spacer}>
              ${island(ConfirmDialog, {
              triggerLabel: vm.t.delete,
              triggerIcon: 'trash',
              triggerVariant: 'danger',
              confirmVariant: 'danger',
              title: vm.t.delete,
              message: vm.t.deleteConfirm,
              confirmLabel: vm.t.delete,
              cancelLabel: vm.t.cancel,
              onConfirm: vm.remove,
              onDone: () => {
                window.location.href = vm.listHref;
              },
            })}
            </li>`
          : nothing
      }
    </menu>
  </form>`;
}

export type { ProductFormText };
