// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { Container } from '@model/containers';

import { containerEditMessages, type ContainerEditText } from './i18n/container-edit-page.messages';
import { getContainer } from './queries/get-container.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface ContainerEditPageData {
  id: string;
  container: Container;
  t: ContainerEditText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadContainerEditPage(request: PageRequest): Promise<ContainerEditPageData> {
  const id = request.routeParams.id;
  const headers = request.headers;
  const t = containerEditMessages(resolveLocale(headers));
  const container = await getContainer(id, headers);
  return { id, container, t, title: `${t.edit} ${container.code}`, description: t.subtitle };
}
