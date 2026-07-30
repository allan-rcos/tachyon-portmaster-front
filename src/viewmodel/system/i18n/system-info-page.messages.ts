/**
 * Catálogo i18n da rota /info. Antes o texto estava fixo em pt-BR dentro do
 * JSX — a tela era a única do produto que não falava o idioma da requisição.
 *
 * @packageDocumentation
 */
import type { Locale } from '@viewmodel/core/i18n/locale';

import { m } from '@/paraglide/messages';

/** Texto do diagnóstico de runtime. */
export interface SystemInfoText {
  /** Linha de contexto em caixa alta, acima do título. */
  eyebrow: string;
  title: string;
  subtitle: string;
  frontend: string;
  version: string;
  environment: string;
  runtime: string;
  memory: string;
  backend: string;
  backendPending: string;
}

export const systemInfoMessages = (locale: Locale): SystemInfoText => ({
  eyebrow: m.info_eyebrow({}, { locale }),
  title: m.info_title({}, { locale }),
  subtitle: m.info_subtitle({}, { locale }),
  frontend: m.info_frontend({}, { locale }),
  version: m.info_version({}, { locale }),
  environment: m.info_environment({}, { locale }),
  runtime: m.info_runtime({}, { locale }),
  memory: m.info_memory({}, { locale }),
  backend: m.info_backend({}, { locale }),
  backendPending: m.info_backend_pending({}, { locale }),
});
