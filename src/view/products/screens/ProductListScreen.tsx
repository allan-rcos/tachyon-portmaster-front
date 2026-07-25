import { AsyncBoundary } from '@view/core/components/AsyncBoundary';
import { Skeleton } from '@view/core/components/Skeleton';
import { createScreenBinding } from '@view/core/screens/createScreenBinding';
import { ProductList } from '@view/products/components/ProductList';
import type { ProductListVM } from '@viewmodel/products/product-list-page.vm';
import type { JSX } from 'solid-js';

/**
 * Tela da listagem de produtos: liga o ViewModel observável ao componente puro.
 *
 * Esta camada existe para que `ProductList` continue recebendo apenas dados
 * prontos — o que a mantém trivial de testar e indiferente à origem dos dados.
 *
 * @param props.vm ViewModel da rota.
 */
export function ProductListScreen(props: { vm: ProductListVM }): JSX.Element {
  const { data, status } = createScreenBinding(props.vm.products, props.vm.load);

  return (
    <AsyncBoundary
      status={status()}
      data={data()}
      fallback={<Skeleton height="18rem" />}
      errorMessage={props.vm.boundary.loadError}
      retryLabel={props.vm.boundary.retry}
      onRetry={() => void props.vm.load()}
    >
      {(page) => <ProductList items={page.data} total={page.total} t={props.vm.t} />}
    </AsyncBoundary>
  );
}
