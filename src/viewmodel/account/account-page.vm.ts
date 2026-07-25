// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { AccountProfile } from '@model/account';

import { accountMessages, type AccountPageText } from './i18n/account-page.messages';
import { getAccount } from './queries/get-account.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface AccountPageData {
  profile: AccountProfile;
  t: AccountPageText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadAccountPage(request: PageRequest): Promise<AccountPageData> {
  const headers = request.headers;
  const t = accountMessages(resolveLocale(headers));
  const profile = await getAccount(headers);
  return { profile, t, title: t.title, description: t.subtitle };
}
