// ============================================================
//  Texto da fronteira de carregamento — o que toda tela que busca dados no
//  navegador precisa dizer quando a busca falha.
//
//  Catálogo próprio, e não mais chaves em `commonText`: só as telas assíncronas
//  consomem estes termos, e metade dos catálogos de rota nem espalha
//  `commonText`. Um fragmento dedicado mantém cada contrato com exatamente o
//  que ele usa — que é a regra que o `i18n:check` faz valer.
// ============================================================
import type { Locale } from './locale';

import { m } from '@/paraglide/messages';

/** Chaves de texto que a fronteira de carregamento consome. */
export interface AsyncBoundaryText {
  loadError: string;
  retry: string;
}

/**
 * Resolve o texto da fronteira de carregamento.
 *
 * @param locale Locale já resolvido pelo contexto do ViewModel.
 */
export const asyncBoundaryMessages = (locale: Locale): AsyncBoundaryText => ({
  loadError: m.common_load_error({}, { locale }),
  retry: m.common_retry({}, { locale }),
});
