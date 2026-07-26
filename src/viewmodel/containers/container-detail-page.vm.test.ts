// ============================================================
//  A regra "que ação o status permite" saiu da island e veio para cá.
//
//  Antes o `ContainerActions` recebia `status` cru e decidia sozinho o que
//  oferecer — máquina de estados do domínio dentro de um componente. Agora ele
//  recebe `canSeal`/`canDispatch` já resolvidos, e o teste da regra é este.
//
//  Ver `@viewmodel/products/product-list-page.vm.test` para o modelo.
// ============================================================
import { ContainerStatus, Permission } from '@model/common';
import { accountProfileFactory, roleRefFactory } from '@viewmodel/account/testing/account.factory';
import { containerFactory, containerSummaryFactory } from '@viewmodel/containers/testing/container.factory';
import type { PageRequest } from '@viewmodel/core/page/page-request';
import { loadAccount } from '@viewmodel/core/session/session';
import { paged } from '@viewmodel/core/testing/factory-support';
import { listProducts } from '@viewmodel/products/queries/list-products.query';
import { productFactory } from '@viewmodel/products/testing/product.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createContainerDetailPageInput } from './container-detail-page.vm';
import { getContainerSummary } from './queries/get-container-summary.query';

vi.mock('./queries/get-container-summary.query');
vi.mock('@viewmodel/products/queries/list-products.query');
vi.mock('@viewmodel/core/session/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@viewmodel/core/session/session')>()),
  loadAccount: vi.fn(),
}));

const mockedSummary = vi.mocked(getContainerSummary);
const mockedProducts = vi.mocked(listProducts);
const mockedAccount = vi.mocked(loadAccount);

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
          permissions: [Permission.ContainerRead, Permission.ContainerSummary],
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
