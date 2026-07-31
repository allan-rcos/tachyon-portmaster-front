// ============================================================
//  A regra "que ação o status permite" saiu da island e veio para cá.
//
//  Antes o `ContainerActions` recebia `status` cru e decidia sozinho o que
//  oferecer — máquina de estados do domínio dentro de um componente. Agora ele
//  recebe `canSeal`/`canDispatch` já resolvidos, e o teste da regra é este.
//
//  Ver `@viewmodel/products/product-list-page.vm.test` para o modelo.
// ============================================================
import { ContainerStatus } from '@model/common';
import { accountProfileFactory, roleRefFactory } from '@viewmodel/account/testing/account.factory';
import { containerDetailMessages } from '@viewmodel/containers/i18n/container-detail-page.messages';
import {
  containerFactory,
  containerSummaryFactory,
} from '@viewmodel/containers/testing/container.factory';
import type { PageRequest } from '@viewmodel/core/page/page-request';
import { loadAccount } from '@viewmodel/core/session/session';
import { paged } from '@viewmodel/core/testing/factory-support';
import { listProducts } from '@viewmodel/products/queries/list-products.query';
import { productFactory } from '@viewmodel/products/testing/product.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createContainerDetailPageInput,
  createContainerDetailVM,
} from './container-detail-page.vm';
import { deleteContainer } from './mutations/delete-container.mutation';
import { dispatchContainer } from './mutations/dispatch-container.mutation';
import { loadManifestItem } from './mutations/load-manifest-item.mutation';
import { sealContainer } from './mutations/seal-container.mutation';
import { unloadManifestItem } from './mutations/unload-manifest-item.mutation';
import { getContainerSummary } from './queries/get-container-summary.query';

vi.mock('./queries/get-container-summary.query');
vi.mock('./mutations/seal-container.mutation');
vi.mock('./mutations/dispatch-container.mutation');
vi.mock('./mutations/delete-container.mutation');
vi.mock('./mutations/load-manifest-item.mutation');
vi.mock('./mutations/unload-manifest-item.mutation');
vi.mock('@viewmodel/products/queries/list-products.query');
vi.mock('@viewmodel/core/session/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@viewmodel/core/session/session')>()),
  loadAccount: vi.fn(),
}));

const mockedSummary = vi.mocked(getContainerSummary);
const mockedSeal = vi.mocked(sealContainer);
const mockedDispatch = vi.mocked(dispatchContainer);
const mockedDelete = vi.mocked(deleteContainer);
const mockedLoad = vi.mocked(loadManifestItem);
const mockedUnload = vi.mocked(unloadManifestItem);
const mockedProducts = vi.mocked(listProducts);
const mockedAccount = vi.mocked(loadAccount);
const t = containerDetailMessages('pt-BR');

const request: PageRequest = {
  headers: { cookie: 'auth_token=abc' },
  url: '/painel/conteineres/ctr_1',
  routeParams: { id: 'ctr_1' },
};

/** Resolve o `PageInput` com o contêiner no status pedido. */
async function factsFor(status: ContainerStatus) {
  mockedSummary.mockResolvedValueOnce(
    containerSummaryFactory.build({ container: containerFactory.build({ status }) }),
  );
  const input = await createContainerDetailPageInput(request);
  return input.facts;
}

beforeEach(() => {
  mockedProducts.mockResolvedValue(paged(productFactory.buildList(2)));
  mockedAccount.mockResolvedValue(
    accountProfileFactory.build({
      roles: [
        roleRefFactory.build({
          permissions: ['container:read', 'container:summary'],
        }),
      ],
    }),
  );
});

describe('ações permitidas por status', () => {
  it('vazio ou carregando: lacra, não despacha', async () => {
    for (const status of [ContainerStatus.Empty, ContainerStatus.Loading]) {
      const facts = await factsFor(status);
      expect(facts.canSeal).toBe(true);
      expect(facts.canDispatch).toBe(false);
    }
  });

  it('lacrado: despacha, não lacra de novo', async () => {
    const facts = await factsFor(ContainerStatus.Sealed);
    expect(facts.canSeal).toBe(false);
    expect(facts.canDispatch).toBe(true);
  });

  it('em trânsito: nada mais a fazer', async () => {
    const facts = await factsFor(ContainerStatus.InTransit);
    expect(facts.canSeal).toBe(false);
    expect(facts.canDispatch).toBe(false);
  });
});

// ============================================================
//  As ações e o editor de manifesto, que saíram das islands
//  `ContainerActions.island.test.tsx` e `ManifestEditor.island.test.tsx`.
//
//  Lá o teste tinha de abrir o `ConfirmDialog` e clicar duas vezes para chegar
//  à mutation; aqui é chamada de função. O que o diálogo faz (confirmar antes de
//  agir) tem teste próprio em `@view/core/islands/ConfirmDialog.island.test.ts`.
// ============================================================
/** Monta o VM do detalhe com o contêiner no status pedido. */
async function vmFor(status: ContainerStatus) {
  mockedSummary.mockResolvedValueOnce(
    containerSummaryFactory.build({ container: containerFactory.build({ status }) }),
  );
  return createContainerDetailVM(await createContainerDetailPageInput(request));
}

describe('ações de estado do contêiner', () => {
  it('lacrar, despachar e excluir viajam com o id da rota', async () => {
    const vm = await vmFor(ContainerStatus.Loading);

    await vm.seal();
    await vm.dispatch();
    await vm.remove();

    // O id vem do `facts`, resolvido pelo `+data` — não do parâmetro de rota.
    expect(mockedSeal).toHaveBeenCalledWith(vm.facts.id);
    expect(mockedDispatch).toHaveBeenCalledWith(vm.facts.id);
    expect(mockedDelete).toHaveBeenCalledWith(vm.facts.id);
  });

  it('REJEITAM na falha — o `ConfirmDialog` é que mostra o erro', async () => {
    mockedSeal.mockRejectedValueOnce(new Error('409'));
    const vm = await vmFor(ContainerStatus.Loading);

    await expect(vm.seal()).rejects.toThrow('409');
  });
});

describe('editor de manifesto', () => {
  it('nasce com o primeiro produto do catálogo selecionado', async () => {
    const vm = await vmFor(ContainerStatus.Loading);
    expect(vm.manifestValue('product_id')).toBe(vm.products[0]?.id);
    expect(vm.manifestValue('quantity')).toBe('');
  });

  it('carregar aplica a entrada validada, com a quantidade em número', async () => {
    const vm = await vmFor(ContainerStatus.Loading);
    vm.setManifest('quantity', '1200');

    await expect(vm.load()).resolves.toBe(true);
    expect(mockedLoad).toHaveBeenCalledWith(vm.facts.id, {
      product_id: vm.products[0]?.id,
      quantity: 1200,
    });
    expect(mockedUnload).not.toHaveBeenCalled();
  });

  it('descarregar usa a MESMA entrada, outra mutation', async () => {
    const vm = await vmFor(ContainerStatus.Loading);
    vm.setManifest('quantity', '300');

    await expect(vm.unload()).resolves.toBe(true);
    expect(mockedUnload).toHaveBeenCalledWith(vm.facts.id, {
      product_id: vm.products[0]?.id,
      quantity: 300,
    });
    expect(mockedLoad).not.toHaveBeenCalled();
  });

  it('não aplica quantidade vazia nem não positiva, e revela o erro', async () => {
    const vm = await vmFor(ContainerStatus.Loading);

    await expect(vm.load()).resolves.toBe(false);
    expect(mockedLoad).not.toHaveBeenCalled();
    expect(vm.manifestError('quantity')).toBeDefined();

    // `-1` não passa nem pelo formato (o campo é de dígitos); `0` passa pelo
    // formato e morre na regra de positividade. São erros diferentes.
    vm.setManifest('quantity', '-1');
    await expect(vm.load()).resolves.toBe(false);
    expect(vm.manifestError('quantity')).toBe(t.quantityFormat);

    vm.setManifest('quantity', '0');
    await expect(vm.load()).resolves.toBe(false);
    expect(vm.manifestError('quantity')).toBe(t.quantityPositive);
  });

  it('falha da API devolve false e libera o formulário', async () => {
    mockedLoad.mockRejectedValueOnce(new Error('500'));
    const vm = await vmFor(ContainerStatus.Loading);
    vm.setManifest('quantity', '10');

    await expect(vm.load()).resolves.toBe(false);
    expect(vm.manifestPending()).toBe(false);
  });
});
