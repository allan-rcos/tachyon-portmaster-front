import { createForm } from '@tanstack/solid-form';
import { createMutation } from '@tanstack/solid-query';
import { FormField } from '@view/core/components/FormField';
import { Icon } from '@view/core/components/Icon';
import { zodValidator } from '@view/core/forms/zod-adapter';
import { IslandProvider } from '@view/core/islands/IslandProvider';
import { cn } from '@view/core/utils/ui';
import { errText } from '@view/core/utils/ui';
import type { ContainerDetailText } from '@viewmodel/containers/i18n/text-contracts';
import { loadManifestItem } from '@viewmodel/containers/mutations/load-manifest-item.mutation';
import { unloadManifestItem } from '@viewmodel/containers/mutations/unload-manifest-item.mutation';
import { createLoadItemSchema, type LoadItemData } from '@viewmodel/containers/schemas/manifest.schema';
import { createSignal, For, type JSX } from 'solid-js';

import styles from './ManifestEditor.island.module.scss';

interface ManifestFormValues {
  product_id: string;
  quantity: string;
}

export interface ProductOption {
  id: string;
  name: string;
}

function Inner(props: {
  containerId: string;
  products: ProductOption[];
  t: ContainerDetailText;
}): JSX.Element {
  const [target, setTarget] = createSignal<'load' | 'unload'>('load');

  const mkOpts = () => ({ onSuccess: () => window.location.reload() });
  const loadMut = createMutation(() => ({
    mutationFn: (v: LoadItemData) => loadManifestItem(props.containerId, v),
    ...mkOpts(),
  }));
  const unloadMut = createMutation(() => ({
    mutationFn: (v: LoadItemData) => unloadManifestItem(props.containerId, v),
    ...mkOpts(),
  }));
  const pending = () => loadMut.isPending || unloadMut.isPending;

  const form = createForm(() => ({
    defaultValues: { product_id: props.products[0]?.id ?? '', quantity: '' } as ManifestFormValues,
    validators: { onChange: zodValidator<ManifestFormValues>(createLoadItemSchema(props.t)) },
    onSubmit: ({ value }) => {
      const data = createLoadItemSchema(props.t).parse(value);
      (target() === 'load' ? loadMut : unloadMut).mutate(data);
    },
  }));

  const submitWith = (which: 'load' | 'unload') => {
    setTarget(which);
    void form.handleSubmit();
  };

  return (
    <form class={styles.form} onSubmit={(e) => e.preventDefault()}>
      <fieldset class={styles.fields} disabled={pending()}>
        <legend class="srOnly">{props.t.manifest}</legend>

        <form.Field name="product_id">
          {(field) => (
            <FormField
              label={props.t.product}
              for="mani-product"
              error={errText(field().state.meta.errors)}
            >
              <select
                id="mani-product"
                class={styles.select}
                value={field().state.value}
                onChange={(e) => field().handleChange(e.currentTarget.value)}
              >
                <For each={props.products}>{(p) => <option value={p.id}>{p.name}</option>}</For>
              </select>
            </FormField>
          )}
        </form.Field>

        <form.Field name="quantity">
          {(field) => (
            <FormField
              label={props.t.quantity}
              for="mani-qty"
              error={errText(field().state.meta.errors)}
            >
              <input
                id="mani-qty"
                type="number"
                min="1"
                class={cn(styles.input, field().state.meta.errors.length > 0 && styles.invalid)}
                value={field().state.value}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                onBlur={field().handleBlur}
                placeholder="0"
              />
            </FormField>
          )}
        </form.Field>
      </fieldset>

      <menu class={styles.actions}>
        <li>
          <button
            type="button"
            class={styles.load}
            onClick={() => submitWith('load')}
            disabled={pending()}
          >
            <Icon name="plus" size={16} />
            {props.t.load}
          </button>
        </li>
        <li>
          <button
            type="button"
            class={styles.unload}
            onClick={() => submitWith('unload')}
            disabled={pending()}
          >
            <Icon name="rotate" size={16} />
            {props.t.unload}
          </button>
        </li>
      </menu>
    </form>
  );
}

/** Editor de manifesto: carrega/descarrega itens (island). */
export function ManifestEditor(props: {
  containerId: string;
  products: ProductOption[];
  t: ContainerDetailText;
}): JSX.Element {
  return (
    <IslandProvider>
      <Inner {...props} />
    </IslandProvider>
  );
}
