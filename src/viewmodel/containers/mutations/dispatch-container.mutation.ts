import { dispatchContainer as apiDispatchContainer } from '@model/containers';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Despacha um contêiner lacrado, colocando-o em trânsito.
 *
 * @param id Identificador opaco do contêiner.
 */
export async function dispatchContainer(id: string): Promise<void> {
  await apiDispatchContainer(browserClient, id);
}
