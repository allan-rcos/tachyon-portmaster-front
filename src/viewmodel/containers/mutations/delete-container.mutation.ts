import { deleteContainer as apiDeleteContainer } from '@model/containers';
import { browserClient } from '@viewmodel/core/client/api-client';

/**
 * Remove um contêiner do pátio.
 *
 * @param id Identificador opaco do contêiner.
 */
export async function deleteContainer(id: string): Promise<void> {
  await apiDeleteContainer(browserClient, id);
}
