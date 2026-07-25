// ============================================================
//  O que estas queries fazem de fato é traduzir a query string da rota nos
//  parâmetros que a API espera. É isso que os testes verificam.
//
//  A versão anterior batia num MSW que reimplementava filtro e paginação, e
//  portanto media o mock, não a query: passava mesmo com o mapeamento errado,
//  desde que o clone da API concordasse com o erro.
// ============================================================
import { listContainerSummaries, listContainers as apiListContainers } from '@model/containers';
import { containerFactory, containerSummaryFactory, paged } from '@testing/factories/model.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getContainerSummary } from './get-container-summary.query';
import { listContainers } from './list-containers.query';

vi.mock('@model/containers');

const mockedList = vi.mocked(apiListContainers);
const mockedSummaries = vi.mocked(listContainerSummaries);

const HEADERS = { cookie: 'auth_token=abc' };

beforeEach(() => {
  mockedList.mockResolvedValue(paged(containerFactory.buildList(3)));
  mockedSummaries.mockResolvedValue(paged([containerSummaryFactory.build()]));
});

describe('listContainers', () => {
  it('aplica o tamanho de página padrão quando a rota não pede outro', async () => {
    await listContainers(HEADERS);
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), { limit: '8' });
  });

  it('repassa limite, cursor, busca e status vindos da query string', async () => {
    await listContainers(
      HEADERS,
      new URLSearchParams({ limit: '3', cursor: '12', search: 'msku', status: 'Sealed' }),
    );
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), {
      limit: '3',
      cursor: '12',
      search: 'msku',
      status: 'Sealed',
    });
  });

  it('omite filtros vazios em vez de enviá-los em branco', async () => {
    await listContainers(HEADERS, new URLSearchParams({ search: '', status: '' }));
    expect(mockedList).toHaveBeenCalledWith(expect.anything(), { limit: '8' });
  });

  it('devolve a página como o Model entregou', async () => {
    const page = paged(containerFactory.buildList(2), '2');
    mockedList.mockResolvedValueOnce(page);
    await expect(listContainers(HEADERS)).resolves.toEqual(page);
  });
});

describe('getContainerSummary', () => {
  it('consulta pelo id e desembrulha o único item da página', async () => {
    const summary = containerSummaryFactory.build();
    mockedSummaries.mockResolvedValueOnce(paged([summary]));

    await expect(getContainerSummary('ctr_1', HEADERS)).resolves.toEqual(summary);
    expect(mockedSummaries).toHaveBeenCalledWith(expect.anything(), { id: 'ctr_1' });
  });

  it('propaga a falha do Model quando o contêiner não existe', async () => {
    mockedSummaries.mockRejectedValueOnce(Object.assign(new Error('Not Found'), { status: 404 }));
    await expect(getContainerSummary('ctr_nope', HEADERS)).rejects.toMatchObject({ status: 404 });
  });
});
