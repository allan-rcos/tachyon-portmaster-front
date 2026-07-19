import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

import { ProductList } from '@/features/products/components/ProductList';

export default function ProductsPage() {
  const data = useData<Data>();
  return <ProductList items={data.items} total={data.total} t={data.t} />;
}
