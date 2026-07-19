import { enc, dec } from '@/services/fbs';
import type {
  LoadItemRequest,
  UnloadItemRequest,
  ManifestResponse,
} from '@/services/gen/flow/v1/manifest';
import type { Codec, CallArgs } from '@/services/http';

export const loadItem: Codec<CallArgs<LoadItemRequest>, ManifestResponse> = {
  method: 'POST',
  path: () => '/v1/manifests/load-item',
  encode: (r) => r.body,
  decode: (raw) => raw as ManifestResponse,
  fbsEncode: (r) => enc.loadItem(r.body!),
  fbsDecode: dec.manifestResult,
};

export const unloadItem: Codec<CallArgs<UnloadItemRequest>, ManifestResponse> = {
  method: 'POST',
  path: () => '/v1/manifests/unload-item',
  encode: (r) => r.body,
  decode: (raw) => raw as ManifestResponse,
  fbsEncode: (r) => enc.unloadItem(r.body!),
  fbsDecode: dec.manifestResult,
};
