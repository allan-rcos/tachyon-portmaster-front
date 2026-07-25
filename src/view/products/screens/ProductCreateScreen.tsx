import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import { FormSkeleton } from '@view/core/components/Skeleton';
import { ProductForm } from '@view/products/islands/ProductForm.island';
import type { ProductCreateVM } from '@viewmodel/products/product-create-page.vm';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

/**
 * Tela de cadastro de produto. Sem carga assíncrona: só o formulário.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductCreateScreen(props: { vm: ProductCreateVM }): JSX.Element {
  return (
    <section>
      <Breadcrumbs
        items={[{ label: props.vm.t.title, href: '/painel/produtos' }, { label: props.vm.t.new }]}
      />
      <PageHeader title={props.vm.t.new} />
      <ClientOnly fallback={<FormSkeleton rows={3} />}>
        <ProductForm mode="create" t={props.vm.t} />
      </ClientOnly>
    </section>
  );
}
