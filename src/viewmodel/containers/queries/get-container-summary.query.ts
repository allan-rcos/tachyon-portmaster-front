import { listContainerSummaries, type ContainerSummary } from '@model/containers';
import { serverClient, type IncomingHeaders } from '@viewmodel/core/client/api-client';

/** Resumo de um contêiner (container + manifesto + telemetria).
 *  Usa GET /v1/containers/summary?id=... (404 se sumir). */
export async function getContainerSummary(
  id: string,
  headers: IncomingHeaders,
): Promise<ContainerSummary> {
  const res = await listContainerSummaries(serverClient(headers), { id });
  return res.data[0];
}
