import { ProductEditScreen } from '@view/products/screens/ProductEditScreen';
import { createProductEditVM } from '@viewmodel/products/product-edit-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createProductEditVM({
    url: pageContext.urlOriginal,
    routeParams: pageContext.routeParams,
  });
  return (
    <ClientOnly fallback={<div />}>
      <ProductEditScreen vm={vm} />
    </ClientOnly>
  );
}
