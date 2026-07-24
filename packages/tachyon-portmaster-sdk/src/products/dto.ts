import type { RiskClass, Paged } from '../common/dto';

export interface Product {
  id: string;
  name: string;
  density: number;
  risk_class: RiskClass;
}

export interface ProductCreateRequest {
  name: string;
  density: number;
  risk_class: RiskClass;
}

export interface ProductUpdateRequest {
  name: string;
  density: number;
  risk_class: RiskClass;
}

export type ProductList = Paged<Product>;
