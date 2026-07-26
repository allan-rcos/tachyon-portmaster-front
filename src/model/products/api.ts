import type { ApiClient } from '@model/core/http';
import { wire } from '@model/core/wire';

import type { Product, ProductCreateRequest, ProductUpdateRequest, ProductList } from './dto';
import { encProductCreate, encProductUpdate, decProduct, decProductList } from './fbs';

export const listProducts = (c: ApiClient, query?: Record<string, string>): Promise<ProductList> =>
  wire(c, { method: 'GET', path: '/v1/products', query, decode: decProductList });

export const getProduct = (c: ApiClient, id: string): Promise<Product> =>
  wire(c, { method: 'GET', path: `/v1/products/${id}`, decode: decProduct });

export const createProduct = (c: ApiClient, body: ProductCreateRequest): Promise<Product> =>
  wire(c, {
    method: 'POST',
    path: '/v1/products',
    body,
    encode: encProductCreate,
    decode: decProduct,
  });

export const updateProduct = (
  c: ApiClient,
  id: string,
  body: ProductUpdateRequest,
): Promise<Product> =>
  wire(c, {
    method: 'PUT',
    path: `/v1/products/${id}`,
    body,
    encode: encProductUpdate,
    decode: decProduct,
  });

export const deleteProduct = (c: ApiClient, id: string): Promise<null> =>
  wire(c, { method: 'DELETE', path: `/v1/products/${id}` });
