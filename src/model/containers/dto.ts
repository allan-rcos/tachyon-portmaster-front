import type { ContainerStatus, TelemetryEvent, Paged } from '@model/common/dto';

/** Contêiner do pátio, com ocupação atual e capacidade máxima. */
export interface Container {
  id: string;
  code: string;
  current_weight: number;
  max_capacity: number;
  status: ContainerStatus;
}

/** Corpo do registro de um contêiner (código e capacidade). */
export interface ContainerCreateRequest {
  code: string;
  max_capacity: number;
}

/** Corpo da atualização de um contêiner — só a capacidade muda. */
export interface ContainerUpdateRequest {
  max_capacity: number;
}

/** Página de contêineres. */
export type ContainerList = Paged<Container>;

/** Item do manifesto: produto, quantidade e peso resultante. */
export interface CargoManifestItem {
  product_id: string;
  product_name: string;
  quantity: number;
  weight: number;
}

/** Evento de telemetria registrado para um contêiner. */
export interface TelemetryLogItem {
  id: string;
  event: TelemetryEvent;
  description: string;
  timestamp: string;
}

/** Contêiner com seu manifesto e telemetria recente, numa chamada só. */
export interface ContainerSummary {
  container: Container;
  manifest: CargoManifestItem[];
  recent_logs: TelemetryLogItem[];
}

/** Página de resumos de contêiner. */
export type ContainerSummaryList = Paged<ContainerSummary>;

// ---- Manifesto (carga/descarga) ----
/** Corpo do carregamento de um item no manifesto. */
export interface LoadItemRequest {
  container_id: string;
  product_id: string;
  quantity: number;
}

/** Corpo da descarga de um item do manifesto. */
export interface UnloadItemRequest {
  container_id: string;
  product_id: string;
  quantity: number;
}

/** Manifesto do contêiner após uma carga ou descarga. */
export interface ManifestResponse {
  message: string;
  container: Container;
}
