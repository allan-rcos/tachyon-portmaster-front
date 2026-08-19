// ============================================================
//  Teste de rota — o modelo a seguir para as demais.
//
//  Cobre as DUAS metades separadamente, que é o ganho da divisão:
//
//   • `createProductListPageInput` (o data) é assíncrono e faz trabalho de
//     servidor: autoriza, resolve i18n e busca a 1ª página. Testado com a query
//     e a sessão mockadas — sem Vike, sem DOM, sem rede;
//   • `createProductListVM` (a reatividade) é SÍNCRONO e não busca nada para
//     existir: recebe dado pronto. Testar paginação vira exercitar `loadMore`.
//
//  Nenhum dos dois precisa de framework de interface para ser exercitado.
// ============================================================
import type { Permission } from '@model/common';
import { accountProfileFactory, roleRefFactory } from '@viewmodel/account/testing/account.factory';
import { ForbiddenError, UnauthorizedError } from '@viewmodel/core/page/page-errors';
import type { PageRequest } from '@viewmodel/core/page/page-request';
import { loadAccount } from '@viewmodel/core/session/session';
import { paged, pageRequest } from '@viewmodel/core/testing/factory-support';
import { listProducts } from '@viewmodel/products/queries/list-products.query';
import { productFactory } from '@viewmodel/products/testing/product.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createProductListPageInput, createProductListVM } from './product-list-page.vm';

vi.mock('@viewmodel/products/queries/list-products.query');
vi.mock('@viewmodel/core/session/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@viewmodel/core/session/session')>()),
  loadAccount: vi.fn(),
}));

const mockedList = vi.mocked(listProducts);
const mockedAccount = vi.mocked(loadAccount);

/** Perfil com as permissões indicadas. */
function accountWith(...permissions: Permission[]) {
  return accountProfileFactory.build({
    roles: [roleRefFactory.build({ permissions })],
  });
}

const request: PageRequest = pageRequest({
  headers: { cookie: 'auth_token=abc' },
  url: '/painel/produtos',
  routeParams: {},
});

beforeEach(() => {
  mockedList.mockResolvedValue(paged(productFactory.buildList(3)));
  mockedAccount.mockResolvedValue(accountWith('product:read', 'product:create'));
});

describe('createProductListPageInput', () => {
  it('entrega as linhas já formatadas, sem DTO', async () => {
    mockedList.mockResolvedValueOnce(
      paged([productFactory.build({ name: 'Diesel S10', density: 0.58, risk_class: 'None' })]),
    );

    const input = await createProductListPageInput(request);

    expect(input.items[0]).toMatchObject({
      name: 'Diesel S10',
      density: '0,58 t/m³',
      risk: { label: expect.any(String), tone: expect.any(String) },
      editHref: expect.stringContaining('/editar'),
    });
  });

  it('é serializável — nada de função ou classe atravessa para o cliente', async () => {
    const input = await createProductListPageInput(request);
    // Se algo aqui fosse função ou instância de classe, o round-trip perderia
    // ou distorceria o valor; é exatamente o que o Vike faz ao hidratar.
    expect(JSON.parse(JSON.stringify(input))).toEqual(input);
  });

  it('avalia a permissão de criar e entrega a decisão pronta', async () => {
    mockedAccount.mockResolvedValueOnce(accountWith('product:read'));
    expect((await createProductListPageInput(request)).canCreate).toBe(false);

    mockedAccount.mockResolvedValueOnce(accountWith('product:read', 'product:create'));
    expect((await createProductListPageInput(request)).canCreate).toBe(true);
  });

  it('recusa quem não tem product:read', async () => {
    mockedAccount.mockResolvedValueOnce(accountWith('metrics:read'));
    await expect(createProductListPageInput(request)).rejects.toThrow(ForbiddenError);
  });

  it('sinaliza sessão ausente sem conhecer redirect', async () => {
    mockedAccount.mockRejectedValueOnce(new Error('401'));
    await expect(createProductListPageInput(request)).rejects.toThrow(UnauthorizedError);
  });

  it('repassa a query string da rota para a busca', async () => {
    await createProductListPageInput({ ...request, url: '/painel/produtos?search=diesel' });

    const [, params] = mockedList.mock.calls[0] ?? [];
    expect(params?.get('search')).toBe('diesel');
  });

  it('resolve o texto no locale da requisição', async () => {
    const pt = await createProductListPageInput(request);
    const en = await createProductListPageInput(pageRequest({ headers: request.headers, url: request.url, locale: 'en' }));
    expect(pt.t.title).not.toBe(en.t.title);
  });

  it('prefixa os destinos com o locale, menos no pt-BR', async () => {
    const pt = await createProductListPageInput(request);
    const en = await createProductListPageInput(pageRequest({ headers: request.headers, url: request.url, locale: 'en' }));
    expect(pt.newHref).toBe('/painel/produtos/nova');
    expect(en.newHref).toBe('/en/painel/produtos/nova');
    expect(en.items[0]?.editHref.startsWith('/en/painel/produtos/')).toBe(true);
  });
});

describe('createProductListVM', () => {
  /** Dado de rota mínimo, com as linhas e o cursor indicados. */
  async function inputWith(nextCursor?: string) {
    mockedList.mockResolvedValueOnce(paged(productFactory.buildList(2), nextCursor));
    return createProductListPageInput(request);
  }

  it('já nasce com as linhas — não busca nada para existir', async () => {
    const vm = createProductListVM(await inputWith());
    mockedList.mockClear();

    expect(vm.items()).toHaveLength(2);
    expect(mockedList).not.toHaveBeenCalled();
  });

  it('acumula a próxima página em vez de substituir', async () => {
    const vm = createProductListVM(await inputWith('cursor-2'));
    mockedList.mockResolvedValueOnce(paged(productFactory.buildList(3)));

    await vm.loadMore();

    expect(vm.items()).toHaveLength(5);
    expect(vm.hasMore()).toBe(false);
  });

  it('não pagina quando não há cursor', async () => {
    const vm = createProductListVM(await inputWith(undefined));
    mockedList.mockClear();

    await vm.loadMore();

    expect(mockedList).not.toHaveBeenCalled();
    expect(vm.hasMore()).toBe(false);
  });

  it('expõe a falha como estado, sem lançar, e permite repetir', async () => {
    const vm = createProductListVM(await inputWith('cursor-2'));
    mockedList.mockRejectedValueOnce(new Error('500'));

    await expect(vm.loadMore()).resolves.toBeUndefined();
    expect(vm.errorMessage()).toBeTruthy();

    mockedList.mockResolvedValueOnce(paged(productFactory.buildList(1)));
    await vm.retry();

    expect(vm.errorMessage()).toBeUndefined();
    expect(vm.items()).toHaveLength(3);
  });

  it('pagina no navegador, sem headers — o servidor só entrega a 1ª página', async () => {
    const vm = createProductListVM(await inputWith('cursor-2'));
    mockedList.mockResolvedValueOnce(paged([]));

    await vm.loadMore();

    const [headers] = mockedList.mock.calls.at(-1) ?? [];
    expect(headers).toBeUndefined();
  });
});
