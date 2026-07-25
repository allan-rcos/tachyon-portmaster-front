import { unloadItem } from '@model/containers';

import { browserClient } from '../../core/client/api-client';
import type { ManifestResponse } from '../domain';
import type { LoadItemData } from '../schemas/manifest.schema';

/**
 * Descarrega um item do manifesto do contêiner.
 *
 * @param containerId Identificador opaco do contêiner.
 * @param input       Produto e quantidade já validados pelo schema.
 */
export function unloadManifestItem(
  containerId: string,
  input: LoadItemData,
): Promise<ManifestResponse> {
  return unloadItem(browserClient, { container_id: containerId, ...input });
}
