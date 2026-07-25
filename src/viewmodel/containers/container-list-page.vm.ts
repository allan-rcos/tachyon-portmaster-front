// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { Container } from '@model/containers';

import { containersListMessages } from './i18n/container-list-page.messages';
import type { ContainerListText } from './i18n/text-contracts';
import { listContainers } from './queries/list-containers.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';
import { searchParams } from '../core/page/page-request';

/** Dados que a rota entrega à View. */
export interface ContainerListPageData {
  items: Container[];
  total: number;
  nextCursor?: string;
  filters: { search: string; status: string };
  t: ContainerListText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadContainerListPage(request: PageRequest): Promise<ContainerListPageData> {
  const headers = request.headers;
  const t = containersListMessages(resolveLocale(headers));
  const query = searchParams(request);
  const res = await listContainers(headers, query);
  return {
    items: res.data,
    total: res.total,
    nextCursor: res.next_cursor,
    filters: { search: query.get('search') ?? '', status: query.get('status') ?? '' },
    t,
    title: t.title,
    description: t.subtitle,
  };
}
