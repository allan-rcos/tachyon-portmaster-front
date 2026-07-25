import { listContainerSummaries, type ContainerSummary } from '@model/containers';
import { resolveClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';
import { PageNotFoundError } from '@viewmodel/core/page/page-request';

/**
 * Busca o resumo de um contêiner: dados, manifesto e telemetria recente.
 *
 * A API não expõe `GET /containers/{id}/summary`; expõe uma listagem filtrada
 * por id, que devolve uma página. Desembrulhar o único item é trabalho desta
 * query — e uma página vazia significa que o contêiner não existe, não que o
 * resumo seja `undefined`, que era o que a versão anterior devolvia (tipado
 * como se não fosse).
 *
 * @param id      Identificador base62 do contêiner, sem conversão.
 * @param headers Cabeçalhos do request no SSR; omitir no navegador.
 * @throws {PageNotFoundError} Se nenhum contêiner casar com o id.
 */
export async function getContainerSummary(
  id: string,
  headers?: IncomingHeaders,
): Promise<ContainerSummary> {
  const res = await listContainerSummaries(resolveClient(headers), { id });
  const summary = res.data[0];
  if (!summary) throw new PageNotFoundError(`Contêiner inexistente: ${id}`);
  return summary;
}
