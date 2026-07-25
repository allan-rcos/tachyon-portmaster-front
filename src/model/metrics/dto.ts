/** Quantidade de contêineres em cada status, para o gráfico de ocupação. */
export interface OccupancyDivision {
  empty: number;
  loading: number;
  sealed: number;
  in_transit: number;
}

/** Indicadores do pátio exibidos no painel operacional. */
export interface Metrics {
  active_containers: number;
  total_containers: number;
  yard_load: number;
  registered_products: number;
  occupancy_division: OccupancyDivision;
}
