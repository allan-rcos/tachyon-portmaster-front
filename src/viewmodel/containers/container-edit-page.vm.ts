// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { Container } from './domain';
import { containerEditMessages } from './i18n/container-edit-page.messages';
import type { ContainerEditText } from './i18n/container-edit-page.messages';
import { getContainer } from './queries/get-container.query';
import { asyncBoundaryMessages, type AsyncBoundaryText } from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, routeParam, type VMContext } from '../core/page/vm-context';

/** Superfície observável da edição de contêiner. */
export interface ContainerEditVM {
  t: ContainerEditText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Identificador opaco do contêiner em edição. */
  id: string;
  container: AsyncSignal<Container, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da edição de contêiner.
 *
 * @param context Contexto de execução; precisa do parâmetro de rota `id`.
 */
export function createContainerEditVM(context: VMContext): ContainerEditVM {
  const t = containerEditMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const id = routeParam(context, 'id');
  const container = createAsyncSignal<Container, []>(() => getContainer(id, context.headers));
  return { t, boundary, id, container, load: () => container.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function containerEditMeta(context: VMContext = {}): PageMeta {
  const t = containerEditMessages(contextLocale(context));
  return { title: t.edit, description: t.subtitle };
}
