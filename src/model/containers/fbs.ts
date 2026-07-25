import type {
  Container,
  ContainerCreateRequest,
  ContainerUpdateRequest,
  ContainerList,
  ContainerSummaryList,
  LoadItemRequest,
  UnloadItemRequest,
  ManifestResponse,
} from './dto';
import { toBytes, buf, fromT } from '../core/fbs-runtime';
import { ContainerCreateRequestT } from '../generated/fbs/api/fbs/container/container-create-request';
import { ContainerListResponse as FbContainerListResponse } from '../generated/fbs/api/fbs/container/container-list-response';
import { ContainerResponse as FbContainerResponse } from '../generated/fbs/api/fbs/container/container-response';
import { ContainerSummaryListResponse as FbContainerSummaryListResponse } from '../generated/fbs/api/fbs/container/container-summary-list-response';
import { ContainerUpdateRequestT } from '../generated/fbs/api/fbs/container/container-update-request';
import { LoadItemRequestT } from '../generated/fbs/api/fbs/manifest/load-item-request';
import { ManifestResponse as FbManifestResponse } from '../generated/fbs/api/fbs/manifest/manifest-response';
import { UnloadItemRequestT } from '../generated/fbs/api/fbs/manifest/unload-item-request';


export const encContainerCreate = (v: ContainerCreateRequest): Uint8Array =>
  toBytes(new ContainerCreateRequestT(v.code, v.max_capacity));

export const encContainerUpdate = (v: ContainerUpdateRequest): Uint8Array =>
  toBytes(new ContainerUpdateRequestT(v.max_capacity));

export const encLoadItem = (v: LoadItemRequest): Uint8Array =>
  toBytes(new LoadItemRequestT(v.container_id, v.product_id, v.quantity));

export const encUnloadItem = (v: UnloadItemRequest): Uint8Array =>
  toBytes(new UnloadItemRequestT(v.container_id, v.product_id, v.quantity));

export const decContainer = (b: Uint8Array): Container =>
  fromT(FbContainerResponse.getRootAsContainerResponse(buf(b)).unpack()) as Container;

export const decContainerList = (b: Uint8Array): ContainerList =>
  fromT(FbContainerListResponse.getRootAsContainerListResponse(buf(b)).unpack()) as ContainerList;

export const decContainerSummaryList = (b: Uint8Array): ContainerSummaryList =>
  fromT(
    FbContainerSummaryListResponse.getRootAsContainerSummaryListResponse(buf(b)).unpack(),
  ) as ContainerSummaryList;

export const decManifestResult = (b: Uint8Array): ManifestResponse =>
  fromT(FbManifestResponse.getRootAsManifestResponse(buf(b)).unpack()) as ManifestResponse;
