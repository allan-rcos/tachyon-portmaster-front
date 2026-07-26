import { createContainer as apiCreateContainer } from '@model/containers';
import type { Container } from '@model/containers/dto';
import type { ContainerCreateData } from '@viewmodel/containers/schemas/container.schema';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Registra um contêiner no pátio.
 *
 * @param input Dados já validados pelo schema de contêiner.
 */
export function createContainer(input: ContainerCreateData): Promise<Container> {
  return apiCreateContainer(browserClient, input);
}
