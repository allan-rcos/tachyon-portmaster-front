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
import {
  encContainerCreate,
  encContainerUpdate,
  encLoadItem,
  encUnloadItem,
  decContainer,
  decContainerList,
  decContainerSummaryList,
  decManifestResult,
} from './fbs';
import type { ApiClient } from '../core/http';
import { wire } from '../core/wire';


export const listContainers = (c: ApiClient, query?: Record<string, string>): Promise<ContainerList> =>
  wire(c, { method: 'GET', path: '/v1/containers', query, decode: decContainerList });

export const getContainer = (c: ApiClient, id: string): Promise<Container> =>
  wire(c, { method: 'GET', path: `/v1/containers/${id}`, decode: decContainer });

export const createContainer = (c: ApiClient, body: ContainerCreateRequest): Promise<Container> =>
  wire(c, {
    method: 'POST',
    path: '/v1/containers',
    body,
    encode: encContainerCreate,
    decode: decContainer,
  });

export const updateContainer = (
  c: ApiClient,
  id: string,
  body: ContainerUpdateRequest,
): Promise<Container> =>
  wire(c, {
    method: 'PUT',
    path: `/v1/containers/${id}`,
    body,
    encode: encContainerUpdate,
    decode: decContainer,
  });

export const deleteContainer = (c: ApiClient, id: string): Promise<null> =>
  wire(c, { method: 'DELETE', path: `/v1/containers/${id}` });

export const sealContainer = (c: ApiClient, id: string): Promise<Container> =>
  wire(c, { method: 'POST', path: `/v1/containers/${id}/seal`, decode: decContainer });

export const dispatchContainer = (c: ApiClient, id: string): Promise<Container> =>
  wire(c, { method: 'POST', path: `/v1/containers/${id}/dispatch`, decode: decContainer });

/**
 * Lista de resumos; passe `query={ id }` para obter um único resumo.
 * @param c Cliente HTTP configurado.
 * @param query Filtros e paginação.
 */
export const listContainerSummaries = (
  c: ApiClient,
  query?: Record<string, string>,
): Promise<ContainerSummaryList> =>
  wire(c, { method: 'GET', path: '/v1/containers/summary', query, decode: decContainerSummaryList });

export const loadItem = (c: ApiClient, body: LoadItemRequest): Promise<ManifestResponse> =>
  wire(c, {
    method: 'POST',
    path: '/v1/manifests/load-item',
    body,
    encode: encLoadItem,
    decode: decManifestResult,
  });

export const unloadItem = (c: ApiClient, body: UnloadItemRequest): Promise<ManifestResponse> =>
  wire(c, {
    method: 'POST',
    path: '/v1/manifests/unload-item',
    body,
    encode: encUnloadItem,
    decode: decManifestResult,
  });
