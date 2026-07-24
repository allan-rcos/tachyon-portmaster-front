// Catálogo i18n da rota /painel (dashboard). Dono do texto é a página; o
// cluster de métricas recebe `t` resolvido por prop (contrato MetricsPanelText).
import type { Locale } from '@/features/core/i18n/locale';
import type { MetricsPanelText } from '@/features/metrics/components/MetricsPanel';
import { m } from '@/paraglide/messages';

export type PainelPageText = MetricsPanelText & { title: string; subtitle: string };

export const painelMessages = (locale: Locale): PainelPageText => ({
  title: m.painel_title({}, { locale }),
  subtitle: m.painel_subtitle({}, { locale }),
  occupancy: m.painel_occupancy({}, { locale }),
  activeContainers: m.painel_active_containers({}, { locale }),
  totalContainers: m.painel_total_containers({}, { locale }),
  yardLoad: m.painel_yard_load({}, { locale }),
  registeredProducts: m.painel_registered_products({}, { locale }),
  statusLoading: m.painel_status_loading({}, { locale }),
  statusSealed: m.painel_status_sealed({}, { locale }),
  statusInTransit: m.painel_status_in_transit({}, { locale }),
  statusEmpty: m.painel_status_empty({}, { locale }),
});
