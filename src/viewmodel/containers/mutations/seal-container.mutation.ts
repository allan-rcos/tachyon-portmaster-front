import { sealContainer as apiSealContainer } from '@model/containers';

import { browserClient } from '../../core/client/api-client';

/**
 * Lacra um contêiner, encerrando alterações no manifesto.
 *
 * @param id Identificador opaco do contêiner.
 */
export async function sealContainer(id: string): Promise<void> {
  await apiSealContainer(browserClient, id);
}
