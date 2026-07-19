import type { PageContextServer } from 'vike/types';

import { getContainerSummary } from '@/features/containers/loaders/getContainerSummary';
import { listProducts } from '@/features/products/loaders/listProducts';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id; // base62 opaco, sem conversão
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'containers');

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
