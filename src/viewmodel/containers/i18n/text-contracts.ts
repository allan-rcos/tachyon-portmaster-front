// ============================================================
//  Contratos de texto do domínio de contêineres.
//  Ver `@viewmodel/products/i18n/text-contracts` para o porquê de o contrato
//  morar no ViewModel.
// ============================================================
import type { ContainerSchemaText } from '../schemas/container.schema';

/** Chaves de texto que a listagem de contêineres consome. */
export interface ContainerListText {
  title: string;
  subtitle: string;
  new: string;
  code: string;
  status: string;
  weight: string;
  capacity: string;
  occupancy: string;
  actions: string;
  edit: string;
  search: string;
  empty: string;
  previous: string;
  next: string;
}

/**
 * Texto do detalhe do contêiner. Contrato do cluster inteiro (ContainerSummary
 * + ManifestTable + TelemetryLog + ContainerActions + ManifestEditor): um único
 * `t` resolvido alimenta todos, e cada um usa o subconjunto de que precisa.
 */
export interface ContainerDetailText {
  title: string;
  edit: string;
  weight: string;
  capacity: string;
  occupancy: string;
  manifest: string;
  logs: string;
  emptyManifest: string;
  product: string;
  quantity: string;
  empty: string;
  seal: string;
  dispatch: string;
  delete: string;
  sealConfirm: string;
  dispatchConfirm: string;
  deleteConfirm: string;
  cancel: string;
  load: string;
  unload: string;
  productRequired: string;
  quantityPositive: string;
}

/** Chaves de texto do formulário de contêiner (criação e edição). */
export interface ContainerFormText extends ContainerSchemaText {
  data: string;
  code: string;
  maxCapacity: string;
  submitError: string;
  create: string;
  save: string;
  cancel: string;
}
