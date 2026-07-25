// ============================================================
//  Teste de ViewModel de tela — o modelo a seguir para os demais.
//
//  A query é mockada; o VM é exercitado sem DOM, sem Vike e sem rede. É essa
//  ausência de dependências que a separação de camadas compra: o que se mede
//  aqui é a lógica da tela, e nada mais.
// ============================================================
import { paged, productFactory } from '@testing/factories/model.factory';
import { listProducts } from '@viewmodel/products/queries/list-products.query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createProductListVM, productListMeta } from './product-list-page.vm';

vi.mock('@viewmodel/products/queries/list-products.query');

const mockedList = vi.mocked(listProducts);

beforeEach(() => {
  mockedList.mockResolvedValue(paged(productFactory.buildList(3)));
});

describe('createProductListVM', () => {
  it('resolve o texto no locale pedido', () => {
    expect(createProductListVM({ locale: 'en' }).t.title).not.toBe(
      createProductListVM({ locale: 'pt-BR' }).t.title,
    );
  });

  it('não busca nada até `load` ser chamado', () => {
    const vm = createProductListVM();
    expect(vm.products.status()).toBe('idle');
    expect(mockedList).not.toHaveBeenCalled();
  });

  it('carrega o catálogo e expõe o resultado como sinal', async () => {
    const page = paged(productFactory.buildList(2));
    mockedList.mockResolvedValueOnce(page);

    const vm = createProductListVM();
    await vm.load();

    expect(vm.products.status()).toBe('success');
    expect(vm.products.data()).toEqual(page);
  });

  it('roda no navegador quando não recebe headers', async () => {
    await createProductListVM().load();
    expect(mockedList).toHaveBeenCalledWith(undefined, undefined);
  });

  it('roda no servidor quando recebe headers — é assim que a rota volta ao SSR', async () => {
    const headers = { cookie: 'auth_token=abc' };
    await createProductListVM({ headers }).load();
    expect(mockedList).toHaveBeenCalledWith(headers, undefined);
  });

  it('repassa a query string da rota para a busca', async () => {
    await createProductListVM({ url: '/painel/produtos?search=diesel' }).load();

    const [, params] = mockedList.mock.calls[0] ?? [];
    expect(params?.get('search')).toBe('diesel');
  });

  it('expõe a falha como estado, sem lançar', async () => {
    mockedList.mockRejectedValueOnce(new Error('500'));

    const vm = createProductListVM();
    await expect(vm.load()).resolves.toBeUndefined();
    expect(vm.products.status()).toBe('error');
  });
});

describe('productListMeta', () => {
  it('devolve título e descrição para o <head>', () => {
    const meta = productListMeta({ locale: 'pt-BR' });
    expect(meta.title).toBeTruthy();
    expect(meta.description).toBeTruthy();
  });
});
