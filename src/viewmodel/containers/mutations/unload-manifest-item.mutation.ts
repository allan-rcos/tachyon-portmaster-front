import { unloadItem } from '@model/containers';
import type { ManifestResponse } from '@model/containers/dto';
import type { LoadItemData } from '@viewmodel/containers/schemas/manifest.schema';
import { browserClient } from '@viewmodel/core/client/api-client';

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
