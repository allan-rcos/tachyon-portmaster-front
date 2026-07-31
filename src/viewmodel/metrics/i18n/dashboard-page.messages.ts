/**
 * Catálogo i18n da rota /painel (dashboard). Dono do texto é a página; o
 * cluster de métricas recebe `t` resolvido por prop (contrato MetricsPanelText).
 *
 * @packageDocumentation
 */
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { MetricsPanelText } from './text-contracts';

import { m } from '@/paraglide/messages';

export type PainelPageText = MetricsPanelText & {
  /** Linha de contexto em caixa alta, acima do título. */
  eyebrow: string;
  title: string;
  subtitle: string;
};

export const painelMessages = (locale: Locale): PainelPageText => ({
  eyebrow: m.metrics_eyebrow({}, { locale }),
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
