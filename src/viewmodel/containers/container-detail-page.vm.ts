// ============================================================
//  Carregador da rota — resolve dados e texto para a página.
//  Recebe `PageRequest` (neutro), nunca o PageContext do Vike.
// ============================================================
import type { ContainerSummary } from '@model/containers';

import { containerDetailMessages, type ContainerDetailPageText } from './i18n/container-detail-page.messages';
import { getContainerSummary } from './queries/get-container-summary.query';
import { resolveLocale } from '../core/i18n/locale';
import type { PageRequest } from '../core/page/page-request';
import { listProducts } from '../products/queries/list-products.query';

/** Dados que a rota entrega à View. */
export interface ContainerDetailPageData {
  summary: ContainerSummary;
  products: { id: string; name: string }[];
  t: ContainerDetailPageText;
  title: string;
  description: string;
}

/**
 * Carrega os dados da rota.
 *
 * @param request Requisição de página, adaptada do roteador.
 */
export async function loadContainerDetailPage(request: PageRequest): Promise<ContainerDetailPageData> {
  const id = request.routeParams.id; // base62 opaco, sem conversão
  const headers = request.headers;
  const t = containerDetailMessages(resolveLocale(headers));

  // Cross-feature: o manifesto precisa do catálogo de produtos.
  const [summary, prods] = await Promise.all([
    getContainerSummary(id, headers),
    listProducts(headers),
  ]);
  return {
    summary,
    products: prods.data.map((p) => ({ id: p.id, name: p.name })),
    t,
    title: summary.container.code,
    description: `${t.summary} — ${summary.container.code}`,
  };
}
