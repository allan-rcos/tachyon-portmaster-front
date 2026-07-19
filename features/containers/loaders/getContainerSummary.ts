import { serverCall, type IncomingHeaders } from '@/services/clients/server';
import { listContainerSummaries as codec } from '@/services/codecs/flow/v1/container';
import type { ContainerSummary } from '@/services/gen/flow/v1/container';

/** Resumo de um contêiner (container + manifesto + telemetria).
 *  Usa GET /v1/containers/summary?id=... (o mock devolve 404 se sumir). */
export async function getContainerSummary(
  id: string,
  headers: IncomingHeaders,
): Promise<ContainerSummary> {
  const res = await serverCall(codec, { query: { id } }, headers);
  return res.data[0];
}
