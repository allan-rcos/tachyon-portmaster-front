// ============================================================
//  ViewModel da rota /painel/produtos.
//
//  Observável: a tela assina `products` e reage. Roda no navegador (o
//  `VMContext` chega sem `headers`); para devolver a rota ao SSR, basta chamar
//  este mesmo VM dentro de um `+data.ts` passando os headers do request —
//  nada aqui muda.
// ============================================================
import type { ProductList } from './domain';
import { productsListMessages } from './i18n/product-list-page.messages';
import type { ProductListText } from './i18n/text-contracts';
import { listProducts } from './queries/list-products.query';
import { asyncBoundaryMessages, type AsyncBoundaryText } from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, contextParams, type VMContext } from '../core/page/vm-context';

/** Superfície observável da listagem de produtos. */
export interface ProductListVM {
  /** Texto da tela, resolvido para o locale do contexto. */
  t: ProductListText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Catálogo de produtos, com estado de carga e erro. */
  products: AsyncSignal<ProductList, []>;
  /** Dispara a carga; chamar de novo recarrega. */
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da listagem de produtos.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createProductListVM(context: VMContext = {}): ProductListVM {
  const t = productsListMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const params = contextParams(context);
  const products = createAsyncSignal<ProductList, []>(() => listProducts(context.headers, params));

  return { t, boundary, products, load: () => products.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 *
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function productListMeta(context: VMContext = {}): PageMeta {
  const t = productsListMessages(contextLocale(context));
  return { title: t.title, description: t.subtitle };
}
