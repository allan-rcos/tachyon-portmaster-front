// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { Product } from './domain';
import { productEditMessages } from './i18n/product-edit-page.messages';
import type { ProductEditText } from './i18n/product-edit-page.messages';
import { getProduct } from './queries/get-product.query';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, routeParam, type VMContext } from '../core/page/vm-context';

/** Superfície observável da edição de produto. */
export interface ProductEditVM {
  t: ProductEditText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Identificador opaco do produto em edição. */
  id: string;
  product: AsyncSignal<Product, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da edição de produto.
 *
 * @param context Contexto de execução; precisa do parâmetro de rota `id`.
 */
export function createProductEditVM(context: VMContext): ProductEditVM {
  const t = productEditMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const id = routeParam(context, 'id');
  const product = createAsyncSignal<Product, []>(() => getProduct(id, context.headers));
  return { t, boundary, id, product, load: () => product.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function productEditMeta(context: VMContext = {}): PageMeta {
  const t = productEditMessages(contextLocale(context));
  return { title: t.edit, description: t.subtitle };
}
