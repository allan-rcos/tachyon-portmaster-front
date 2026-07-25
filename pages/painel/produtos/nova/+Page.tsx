import { ProductCreateScreen } from '@view/products/screens/ProductCreateScreen';
import { createProductCreateVM } from '@viewmodel/products/product-create-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createProductCreateVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <ProductCreateScreen vm={vm} />
    </ClientOnly>
  );
}
