import { ProductCreateRequestT } from '../fbs-gen/api/fbs/product/product-create-request';
import { ProductListResponse as FbProductListResponse } from '../fbs-gen/api/fbs/product/product-list-response';
import { ProductResponse as FbProductResponse } from '../fbs-gen/api/fbs/product/product-response';
import { ProductUpdateRequestT } from '../fbs-gen/api/fbs/product/product-update-request';
import { toBytes, buf, fromT, riskIndex } from '../core/fbs-runtime';

import type { Product, ProductCreateRequest, ProductUpdateRequest, ProductList } from './dto';

export const encProductCreate = (v: ProductCreateRequest): Uint8Array =>
  toBytes(new ProductCreateRequestT(v.name, v.density, riskIndex(v.risk_class)));

export const encProductUpdate = (v: ProductUpdateRequest): Uint8Array =>
  toBytes(new ProductUpdateRequestT(v.name, v.density, riskIndex(v.risk_class)));

export const decProduct = (b: Uint8Array): Product =>
  fromT(FbProductResponse.getRootAsProductResponse(buf(b)).unpack()) as Product;

export const decProductList = (b: Uint8Array): ProductList =>
  fromT(FbProductListResponse.getRootAsProductListResponse(buf(b)).unpack()) as ProductList;
