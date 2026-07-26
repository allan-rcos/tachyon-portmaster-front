import { getProduct as apiGetProduct, listProducts as apiListProducts } from '@model/products';
import { paged } from '@viewmodel/core/testing/factory-support';
import { productFactory } from '@viewmodel/products/testing/product.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getProduct } from './get-product.query';
import { listProducts } from './list-products.query';

vi.mock('@model/products');

const mockedList = vi.mocked(apiListProducts);
const mockedGet = vi.mocked(apiGetProduct);
const HEADERS = { cookie: 'auth_token=abc' };

beforeEach(() => {
  mockedList.mockResolvedValue(paged(productFactory.buildList(3)));
  mockedGet.mockResolvedValue(productFactory.build());
});

describe('listProducts', () => {
  it('pede o catálogo inteiro por padrão — o formulário de manifesto depende disso', async () => {
    await listProducts(HEADERS);
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), { limit: '50' });
  });

  it('repassa cursor e busca vindos da query string', async () => {
    await listProducts(HEADERS, new URLSearchParams({ cursor: '10', search: 'diesel' }));
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), {
      limit: '50',
      cursor: '10',
      search: 'diesel',
    });
  });
});

describe('getProduct', () => {
  it('busca pelo id opaco, sem conversão', async () => {
    const product = productFactory.build({ id: 'prd_soja' });
    mockedGet.mockResolvedValueOnce(product);

    await expect(getProduct('prd_soja', HEADERS)).resolves.toEqual(product);
    expect(mockedGet).toHaveBeenCalledWith(expect.anything(), 'prd_soja');
  });
});
