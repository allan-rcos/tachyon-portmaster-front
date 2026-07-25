import { ProductListScreen } from '@view/products/screens/ProductListScreen';
import { createProductListVM } from '@viewmodel/products/product-list-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createProductListVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <ProductListScreen vm={vm} />
    </ClientOnly>
  );
}
