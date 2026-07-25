import { ProductList } from '@view/products/components/ProductList';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';


export default function ProductsPage() {
  const data = useData<Data>();
  return <ProductList items={data.items} total={data.total} t={data.t} />;
}
