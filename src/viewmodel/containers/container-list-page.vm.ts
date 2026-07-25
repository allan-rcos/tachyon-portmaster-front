// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { ContainerList } from './domain';
import { containersListMessages } from './i18n/container-list-page.messages';
import type { ContainerListText } from './i18n/text-contracts';
import { listContainers } from './queries/list-containers.query';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, contextParams, type VMContext } from '../core/page/vm-context';

/** Filtros ativos da listagem, lidos da query string. */
export interface ContainerListFilters {
  search: string;
  status: string;
}

/** Superfície observável da listagem de contêineres. */
export interface ContainerListVM {
  t: ContainerListText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  filters: ContainerListFilters;
  containers: AsyncSignal<ContainerList, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel da listagem de contêineres.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createContainerListVM(context: VMContext = {}): ContainerListVM {
  const t = containersListMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const params = contextParams(context);
  const filters: ContainerListFilters = {
    search: params?.get('search') ?? '',
    status: params?.get('status') ?? '',
  };
  const containers = createAsyncSignal<ContainerList, []>(() =>
    listContainers(context.headers, params),
  );
  return { t, boundary, filters, containers, load: () => containers.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function containerListMeta(context: VMContext = {}): PageMeta {
  const t = containersListMessages(contextLocale(context));
  return { title: t.title, description: t.subtitle };
}
