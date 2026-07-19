import type { Container } from './container';

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
