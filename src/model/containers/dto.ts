import type { ContainerStatus, TelemetryEvent, Paged } from '../common/dto';

export interface Container {
  id: string;
  code: string;
  current_weight: number;
  max_capacity: number;
  status: ContainerStatus;
}

export interface ContainerCreateRequest {
  code: string;
  max_capacity: number;
}

export interface ContainerUpdateRequest {
  max_capacity: number;
}

export type ContainerList = Paged<Container>;

export interface CargoManifestItem {
  product_id: string;
  product_name: string;
  quantity: number;
  weight: number;
}

export interface TelemetryLogItem {
  id: string;
  event: TelemetryEvent;
  description: string;
  timestamp: string;
}

export interface ContainerSummary {
  container: Container;
  manifest: CargoManifestItem[];
  recent_logs: TelemetryLogItem[];
}

export type ContainerSummaryList = Paged<ContainerSummary>;

// ---- Manifesto (carga/descarga) ----
export interface LoadItemRequest {
  container_id: string;
  product_id: string;
  quantity: number;
}

export interface UnloadItemRequest {
  container_id: string;
  product_id: string;
  quantity: number;
}

export interface ManifestResponse {
  message: string;
  container: Container;
}
