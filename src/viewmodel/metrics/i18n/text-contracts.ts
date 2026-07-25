// ============================================================
//  Contratos de texto do painel de métricas.
//  Ver `@viewmodel/products/i18n/text-contracts` para o porquê de o contrato
//  morar no ViewModel.
// ============================================================

/**
 * Texto do painel de métricas. Contrato do cluster inteiro (StatTiles +
 * OccupancyBreakdown + OccupancyChart): um único `t` resolvido alimenta todos,
 * e cada componente usa o subconjunto de que precisa.
 */
export interface MetricsPanelText {
  occupancy: string;
  activeContainers: string;
  totalContainers: string;
  yardLoad: string;
  registeredProducts: string;
  statusLoading: string;
  statusSealed: string;
  statusInTransit: string;
  statusEmpty: string;
}
