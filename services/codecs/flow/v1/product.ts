import { enc, dec } from '@/services/fbs';
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductList,
} from '@/services/gen/flow/v1/product';
import type { Codec, CallArgs } from '@/services/http';

export const listProducts: Codec<CallArgs, ProductList> = {
  method: 'GET',
  path: () => '/v1/products',
  encode: () => undefined,
  decode: (raw) => raw as ProductList,
  fbsDecode: dec.productList,
};

export const getProduct: Codec<CallArgs, Product> = {
  method: 'GET',
  path: (r) => `/v1/products/${r.params!.id}`,
  encode: () => undefined,
  decode: (raw) => raw as Product,
  fbsDecode: dec.product,
};

export const createProduct: Codec<CallArgs<ProductCreateRequest>, Product> = {
  method: 'POST',
  path: () => '/v1/products',
  encode: (r) => r.body,
  decode: (raw) => raw as Product,
  fbsEncode: (r) => enc.productCreate(r.body!),
  fbsDecode: dec.product,
};

export const updateProduct: Codec<CallArgs<ProductUpdateRequest>, Product> = {
  method: 'PUT',
  path: (r) => `/v1/products/${r.params!.id}`,
  encode: (r) => r.body,
  decode: (raw) => raw as Product,
  fbsEncode: (r) => enc.productUpdate(r.body!),
  fbsDecode: dec.product,
};

export const deleteProduct: Codec<CallArgs, null> = {
  method: 'DELETE',
  path: (r) => `/v1/products/${r.params!.id}`,
  encode: () => undefined,
  decode: () => null,
};
