import { createContainer as apiCreateContainer } from '@model/containers';

import { browserClient } from '../../core/client/api-client';
import type { Container } from '../domain';
import type { ContainerCreateData } from '../schemas/container.schema';

/**
 * Registra um contêiner no pátio.
 *
 * @param input Dados já validados pelo schema de contêiner.
 */
export function createContainer(input: ContainerCreateData): Promise<Container> {
  return apiCreateContainer(browserClient, input);
}
