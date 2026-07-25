// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================

import { containerNewMessages, type ContainerNewText } from './i18n/container-create-page.messages';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface ContainerCreatePageData {
  t: ContainerNewText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadContainerCreatePage(request: PageRequest): Promise<ContainerCreatePageData> {
  const t = containerNewMessages(resolveLocale(request.headers));
  return { t, title: t.new, description: t.subtitle };
}
