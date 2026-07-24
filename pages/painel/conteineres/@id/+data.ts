import type { ContainerSummary } from 'tachyon-portmaster-sdk/containers';
import type { PageContextServer } from 'vike/types';

import { containerDetailMessages, type ContainerDetailPageText } from './messages';

import { getContainerSummary } from '@/features/containers/loaders/getContainerSummary';
import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';
import { listProducts } from '@/features/products/loaders/listProducts';

export interface Data {
  summary: ContainerSummary;
  products: { id: string; name: string }[];
  t: ContainerDetailPageText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const id = pageContext.routeParams.id; // base62 opaco, sem conversão
  const headers = pageContext.headers as IncomingHeaders;
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
