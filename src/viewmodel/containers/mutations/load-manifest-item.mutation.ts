import { loadItem } from '@model/containers';

import { browserClient } from '../../core/client/api-client';
import type { ManifestResponse } from '../domain';
import type { LoadItemData } from '../schemas/manifest.schema';

/**
 * Carrega um item no manifesto do contêiner.
 *
 * @param containerId Identificador opaco do contêiner.
 * @param input       Produto e quantidade já validados pelo schema.
 */
export function loadManifestItem(
  containerId: string,
  input: LoadItemData,
): Promise<ManifestResponse> {
  return loadItem(browserClient, { container_id: containerId, ...input });
}
