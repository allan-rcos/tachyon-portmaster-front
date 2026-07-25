// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================

import { loginMessages, type LoginPageText } from './i18n/login-page.messages';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface LoginPageData {
  t: LoginPageText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadLoginPage(request: PageRequest): Promise<LoginPageData> {
  const t = loginMessages(resolveLocale(request.headers));
  return { t, title: t.title, description: t.subtitle };
}
