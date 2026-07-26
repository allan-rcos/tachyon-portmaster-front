import { updateContainer as apiUpdateContainer } from '@model/containers';
import type { Container } from '@model/containers/dto';
import type { ContainerUpdateData } from '@viewmodel/containers/schemas/container.schema';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Atualiza a capacidade máxima de um contêiner.
 *
 * @param id    Identificador opaco do contêiner.
 * @param input Dados já validados pelo schema de contêiner.
 */
export function updateContainer(id: string, input: ContainerUpdateData): Promise<Container> {
  return apiUpdateContainer(browserClient, id, input);
}
