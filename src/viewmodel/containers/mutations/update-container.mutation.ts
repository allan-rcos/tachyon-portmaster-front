import { updateContainer as apiUpdateContainer } from '@model/containers';

import { browserClient } from '../../core/client/api-client';
import type { Container } from '../domain';
import type { ContainerUpdateData } from '../schemas/container.schema';

/**
 * Atualiza a capacidade máxima de um contêiner.
 *
 * @param id    Identificador opaco do contêiner.
 * @param input Dados já validados pelo schema de contêiner.
 */
export function updateContainer(id: string, input: ContainerUpdateData): Promise<Container> {
  return apiUpdateContainer(browserClient, id, input);
}
