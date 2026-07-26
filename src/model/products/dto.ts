import type { RiskClass, Paged } from '@model/common/dto';

/** Produto do catálogo, com densidade e classe de risco. */
export interface Product {
  id: string;
  name: string;
  density: number;
  risk_class: RiskClass;
}

/** Corpo do cadastro de produto. */
export interface ProductCreateRequest {
  name: string;
  density: number;
  risk_class: RiskClass;
}

/** Corpo da atualização de produto. */
export interface ProductUpdateRequest {
  name: string;
  density: number;
  risk_class: RiskClass;
}

/** Página de produtos. */
export type ProductList = Paged<Product>;
