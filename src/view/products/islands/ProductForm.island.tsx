import { createForm } from '@tanstack/solid-form';
import { FormField } from '@view/core/components/FormField';
import { zodValidator } from '@view/core/forms/zod-adapter';
import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import { bindMutation } from '@view/core/observable/bind-mutation';
import { cn } from '@view/core/utils/ui';
import { errText } from '@view/core/utils/ui';
import { RISK_CLASS, type RiskClass } from '@viewmodel/core/domain';
import { RISK_CLASS_LABEL } from '@viewmodel/core/i18n/labels';
import { createMutationSignal } from '@viewmodel/core/observable/mutation-signal';
import type { ProductFormText } from '@viewmodel/products/i18n/text-contracts';
import { createProduct } from '@viewmodel/products/mutations/create-product.mutation';
import { deleteProduct } from '@viewmodel/products/mutations/delete-product.mutation';
import { updateProduct } from '@viewmodel/products/mutations/update-product.mutation';
import { createProductSchema } from '@viewmodel/products/schemas/product.schema';
import { For, Show, type JSX } from 'solid-js';

import styles from './ProductForm.island.module.scss';

interface FormValues {
  name: string;
  density: string;
  risk_class: RiskClass;
}

export interface ProductFormProps {
  mode: 'create' | 'edit';
  t: ProductFormText;
  productId?: string;
  defaultValues?: { name: string; density: number; risk_class: RiskClass };
}

function Inner(props: ProductFormProps): JSX.Element {
  const mutation = bindMutation(
    createMutationSignal(
      (value: FormValues) => {
        const body = createProductSchema(props.t).parse(value);
        return props.mode === 'create'
          ? createProduct(body)
          : updateProduct(props.productId!, body);
      },
      {
        onSuccess: () => {
          window.location.href = '/painel/produtos';
        },
      },
    ),
  );

  const form = createForm(() => ({
    defaultValues: {
      name: props.defaultValues?.name ?? '',
      density: props.defaultValues?.density != null ? String(props.defaultValues.density) : '',
      risk_class: props.defaultValues?.risk_class ?? 'None',
    } as FormValues,
    validators: { onChange: zodValidator<FormValues>(createProductSchema(props.t)) },
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
      <fieldset class={styles.fields} disabled={mutation.isPending()}>
        <legend class="srOnly">{props.t.data}</legend>

        <form.Field name="name">
          {(field) => (
            <FormField label={props.t.name} for="name" error={errText(field().state.meta.errors)}>
              <input
                id="name"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="Farelo de soja"
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="density">
          {(field) => (
            <FormField
              label={props.t.density}
              for="density"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="density"
                type="number"
                step="0.01"
                min="0"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="0,58"
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="risk_class">
          {(field) => (
            <FormField label={props.t.riskClass} for="risk_class">
              <select
                id="risk_class"
                class={styles.input}
                value={field().state.value}
                onChange={(e) => field().handleChange(e.currentTarget.value as RiskClass)}
              >
                <For each={RISK_CLASS}>
                  {(rc) => <option value={rc}>{RISK_CLASS_LABEL[rc]}</option>}
                </For>
              </select>
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <p class={styles.error} role="alert" hidden={!mutation.isError()}>
        {props.t.submitError}
      </p>

      <menu class={styles.actions}>
        <li>
          <button
            type="submit"
            class={cn(styles.submit, mutation.isPending() && styles.loading)}
            disabled={mutation.isPending()}
          >
            {props.mode === 'create' ? props.t.create : props.t.save}
          </button>
        </li>
        <li>
          <a class={styles.cancel} href="/painel/produtos">
            {props.t.cancel}
          </a>
        </li>
        <Show when={props.mode === 'edit'}>
          <li class={styles.spacer}>
            <ConfirmDialog
              triggerLabel={props.t.delete}
              triggerIcon="trash"
              triggerVariant="danger"
              confirmVariant="danger"
              title={props.t.delete}
              message={props.t.deleteConfirm}
              confirmLabel={props.t.delete}
              cancelLabel={props.t.cancel}
              onConfirm={() => deleteProduct(props.productId!)}
              onDone={() => {
                window.location.href = '/painel/produtos';
              }}
            />
          </li>
        </Show>
      </menu>
    </form>
  );
}

/** Formulário de produto (island) — cria/edita e, em edição, exclui. */
export function ProductForm(props: ProductFormProps): JSX.Element {
  return <Inner {...props} />;
}

export type { ProductFormText };
