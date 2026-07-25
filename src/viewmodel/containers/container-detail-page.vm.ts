// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { ContainerSummary } from './domain';
import { containerDetailMessages } from './i18n/container-detail-page.messages';
import type { ContainerDetailPageText } from './i18n/container-detail-page.messages';
import { getContainerSummary } from './queries/get-container-summary.query';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, routeParam, type VMContext } from '../core/page/vm-context';
import { listProducts } from '../products/queries/list-products.query';

/** Opção de produto oferecida no editor de manifesto. */
export interface ProductOption {
  id: string;
  name: string;
}

/** Resumo do contêiner junto do catálogo que o manifesto precisa. */
export interface ContainerDetailData {
  summary: ContainerSummary;
  products: ProductOption[];
}

/** Superfície observável do detalhe de contêiner. */
export interface ContainerDetailVM {
  t: ContainerDetailPageText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Identificador opaco do contêiner. */
  id: string;
  data: AsyncSignal<ContainerDetailData, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel do detalhe de contêiner.
 *
 * Cruza duas features: o manifesto precisa do catálogo de produtos para
 * oferecer o que carregar. As duas buscas vão em paralelo.
 *
 * @param context Contexto de execução; precisa do parâmetro de rota `id`.
 */
export function createContainerDetailVM(context: VMContext): ContainerDetailVM {
  const t = containerDetailMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const id = routeParam(context, 'id');
  const data = createAsyncSignal<ContainerDetailData, []>(async () => {
    const [summary, products] = await Promise.all([
      getContainerSummary(id, context.headers),
      listProducts(context.headers),
    ]);
    return { summary, products: products.data.map((p) => ({ id: p.id, name: p.name })) };
  });
  return { t, boundary, id, data, load: () => data.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function containerDetailMeta(context: VMContext = {}): PageMeta {
  const t = containerDetailMessages(contextLocale(context));
  return { title: t.title, description: t.summary };
}
