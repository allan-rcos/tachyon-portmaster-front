import { enc, dec } from '@/services/fbs';
import type {
  Container,
  ContainerCreateRequest,
  ContainerUpdateRequest,
  ContainerList,
  ContainerSummaryList,
} from '@/services/gen/flow/v1/container';
import type { Codec, CallArgs } from '@/services/http';

export const listContainers: Codec<CallArgs, ContainerList> = {
  method: 'GET',
  path: () => '/v1/containers',
  encode: () => undefined,
  decode: (raw) => raw as ContainerList,
  fbsDecode: dec.containerList,
};

export const getContainer: Codec<CallArgs, Container> = {
  method: 'GET',
  path: (r) => `/v1/containers/${r.params!.id}`,
  encode: () => undefined,
  decode: (raw) => raw as Container,
  fbsDecode: dec.container,
};

export const createContainer: Codec<CallArgs<ContainerCreateRequest>, Container> = {
  method: 'POST',
  path: () => '/v1/containers',
  encode: (r) => r.body,
  decode: (raw) => raw as Container,
  fbsEncode: (r) => enc.containerCreate(r.body!),
  fbsDecode: dec.container,
};

export const updateContainer: Codec<CallArgs<ContainerUpdateRequest>, Container> = {
  method: 'PUT',
  path: (r) => `/v1/containers/${r.params!.id}`,
  encode: (r) => r.body,
  decode: (raw) => raw as Container,
  fbsEncode: (r) => enc.containerUpdate(r.body!),
  fbsDecode: dec.container,
};

export const deleteContainer: Codec<CallArgs, null> = {
  method: 'DELETE',
  path: (r) => `/v1/containers/${r.params!.id}`,
  encode: () => undefined,
  decode: () => null,
};

export const sealContainer: Codec<CallArgs, Container> = {
  method: 'POST',
  path: (r) => `/v1/containers/${r.params!.id}/seal`,
  encode: () => undefined,
  decode: (raw) => raw as Container,
  fbsDecode: dec.container,
};

export const dispatchContainer: Codec<CallArgs, Container> = {
  method: 'POST',
  path: (r) => `/v1/containers/${r.params!.id}/dispatch`,
  encode: () => undefined,
  decode: (raw) => raw as Container,
  fbsDecode: dec.container,
};

/** Lista de resumos; passe `query={ id }` para obter um único resumo. */
export const listContainerSummaries: Codec<CallArgs, ContainerSummaryList> = {
  method: 'GET',
  path: () => '/v1/containers/summary',
  encode: () => undefined,
  decode: (raw) => raw as ContainerSummaryList,
  fbsDecode: dec.containerSummaryList,
};
