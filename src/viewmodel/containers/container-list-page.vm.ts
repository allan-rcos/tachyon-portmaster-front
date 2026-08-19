/**
 * Rota /painel/conteineres.
 *
 * Mesmo desenho de `@viewmodel/products/product-list-page.vm`, que documenta
 * os dois papéis. Duas diferenças próprias desta tela:
 *
 * • a ocupação (peso ÷ capacidade) é calculada AQUI e entregue já em número
 *   para a barra e em string para o rótulo — a View não faz aritmética;
 * • os filtros da query string viram opções prontas para o `<select>`, com o
 *   rótulo traduzido e a marcação de selecionado já resolvida.
 *
 * @packageDocumentation
 */
import { ContainerStatus } from '@model/common';
import type { Container } from '@model/containers/dto';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '@viewmodel/core/i18n/async-boundary.messages';
import {
  containerStatusLabels,
  CONTAINER_STATUS_TONE,
  type Tone,
} from '@viewmodel/core/i18n/labels';
import { localizedHref, type Locale } from '@viewmodel/core/i18n/locale';
import { authorize, can } from '@viewmodel/core/page/authorize';
import { searchParams, type PageMeta, type PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { formatPercent, formatWeight } from '@viewmodel/core/utils/formatters';
import { signal } from 'alien-signals';

import { containersListMessages } from './i18n/container-list-page.messages';
import type { ContainerListText } from './i18n/text-contracts';
import { listContainers } from './queries/list-containers.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const CONTAINER_LIST_PERMISSIONS = ['container:read'] as const;

/** Permissões exigidas para criar um contêiner (habilitam o botão "novo"). */
const CONTAINER_CREATE_PERMISSIONS = ['container:create'] as const;

/** Uma linha da listagem, já em formato de apresentação. */
export interface ContainerRowData {
  /** Id opaco base62, usado como chave de lista. */
  id: string;
  /** Código ISO do contêiner. */
  code: string;
  /** Status resolvido para rótulo + tom do selo. */
  status: { label: string; tone: Tone };
  /** Peso atual já formatado, com unidade. */
  weight: string;
  /** Capacidade máxima já formatada, com unidade. */
  capacity: string;
  /** Ocupação em 0–100, para a largura da barra. */
  occupancyValue: number;
  /** Ocupação já formatada, para o rótulo. */
  occupancy: string;
  /** Destino do detalhe do contêiner. */
  detailHref: string;
  /** Destino do link de edição. */
  editHref: string;
}

/** Uma aba do filtro de status. */
export interface StatusFilterOption {
  /** Valor da query string; vazio significa "todos". */
  value: string;
  /** Rótulo já traduzido. */
  label: string;
  /** Se está selecionada segundo a query string. */
  selected: boolean;
  /**
   * Destino da aba, com os OUTROS filtros preservados.
   *
   * As abas são links, não botões: o recorte já vem renderizado pelo servidor,
   * funciona sem JS e fica compartilhável na URL. Quem monta rota é esta
   * camada — a View só segue o `href`.
   */
  href: string;
}

/** Filtros ativos da listagem, lidos da query string. */
export interface ContainerListFilters {
  /** Termo de busca corrente. */
  search: string;
  /** Status selecionado; vazio significa "todos". */
  status: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ContainerListPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: ContainerListText;
  /** Texto da fronteira de carregamento. */
  boundary: AsyncBoundaryText;
  /** Primeira página, já formatada. */
  items: readonly ContainerRowData[];
  /** Cursor da próxima página; ausente quando acabou. */
  nextCursor?: string;
  /** Filtros correntes, para repovoar o formulário. */
  filters: ContainerListFilters;
  /** Opções do filtro de status, já traduzidas e marcadas. */
  statusOptions: readonly StatusFilterOption[];
  /** Permissão de criação, já avaliada. */
  canCreate: boolean;
  /** Destino do botão "novo contêiner". */
  newHref: string;
  /** Locale resolvido, para formatar as páginas seguintes igual à primeira. */
  locale: Locale;
}

/**
 * Ocupação percentual do contêiner, em escala de 0 a 100.
 *
 * @param c Contêiner vindo do Model.
 */
function occupancyOf(c: Container): number {
  return c.max_capacity ? Math.round((c.current_weight / c.max_capacity) * 1000) / 10 : 0;
}

/**
 * Converte o DTO do Model na linha que a tela desenha.
 *
 * @param c      Contêiner vindo do Model.
 * @param locale Locale da apresentação.
 */
function toRow(c: Container, locale: Locale): ContainerRowData {
  const value = occupancyOf(c);
  return {
    id: c.id,
    code: c.code,
    status: {
      label: containerStatusLabels(locale)[c.status],
      tone: CONTAINER_STATUS_TONE[c.status],
    },
    weight: formatWeight(c.current_weight, locale),
    capacity: formatWeight(c.max_capacity, locale),
    occupancyValue: Math.min(value, 100),
    occupancy: formatPercent(value, locale),
    detailHref: localizedHref(`/painel/conteineres/${c.id}`, locale),
    editHref: localizedHref(`/painel/conteineres/${c.id}/editar`, locale),
  };
}

/**
 * Monta o destino de uma aba de status preservando a busca corrente.
 *
 * @param status Valor do filtro; vazio significa "todos".
 * @param search Termo de busca a preservar.
 * @param locale Locale da requisição — trocar de aba não troca de idioma.
 */
function statusHref(status: string, search: string, locale: Locale): string {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  const query = params.toString();
  const path = query ? `/painel/conteineres?${query}` : '/painel/conteineres';
  return localizedHref(path, locale);
}

/**
 * O trabalho de servidor da rota: sessão, permissão, i18n, filtros e 1ª página.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `ContainerRead`.
 */
export async function createContainerListPageInput(
  request: PageRequest,
): Promise<ContainerListPageInput> {
  const account = await authorize(request, CONTAINER_LIST_PERMISSIONS);
  const locale = request.t();
  const t = containersListMessages(locale);
  const params = searchParams(request);
  const filters: ContainerListFilters = {
    search: params.get('search') ?? '',
    status: params.get('status') ?? '',
  };
  const page = await listContainers(request.headers, params);

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account, request),
    t,
    boundary: asyncBoundaryMessages(locale),
    items: page.data.map((c) => toRow(c, locale)),
    nextCursor: page.next_cursor,
    filters,
    statusOptions: [
      { value: '', label: t.allStatuses },
      ...Object.values(ContainerStatus).map((s) => ({
        value: s,
        label: containerStatusLabels(locale)[s],
      })),
    ].map(({ value, label }) => ({
      value,
      label,
      selected: filters.status === value,
      href: statusHref(value, filters.search, request.t()),
    })),
    canCreate: can(account, CONTAINER_CREATE_PERMISSIONS),
    newHref: request.href('/painel/conteineres/nova'),
    locale,
  };
}

/** Superfície reativa da listagem de contêineres. */
export interface ContainerListVM {
  /** Texto da tela. */
  t: ContainerListText;
  /** Texto da fronteira de carregamento. */
  boundary: AsyncBoundaryText;
  /** Linhas acumuladas — cresce a cada `loadMore`. */
  items: () => readonly ContainerRowData[];
  /** Filtros correntes, para repovoar o formulário. */
  filters: ContainerListFilters;
  /** Opções do filtro de status. */
  statusOptions: readonly StatusFilterOption[];
  /** Permissão de criação, já avaliada no servidor. */
  canCreate: boolean;
  /** Destino do botão "novo contêiner". */
  newHref: string;
  /** Há mais páginas a carregar. */
  hasMore: () => boolean;
  /** Uma página adicional está em voo. */
  isLoadingMore: () => boolean;
  /** Mensagem de erro da última tentativa, se houve. */
  errorMessage: () => string | undefined;
  /** Carrega a próxima página. Passar direto ao handler, sem lambda. */
  loadMore: () => Promise<void>;
  /** Repete a tentativa que falhou. Passar direto ao handler, sem lambda. */
  retry: () => Promise<void>;
}

/**
 * Cria o ViewModel da listagem a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createContainerListVM(input: ContainerListPageInput): ContainerListVM {
  const items = signal<readonly ContainerRowData[]>(input.items);
  const cursor = signal<string | undefined>(input.nextCursor);
  const loadingMore = signal(false);
  const failed = signal(false);

  async function fetchNext(): Promise<void> {
    const next = cursor();
    if (next === undefined || loadingMore()) return;
    loadingMore(true);
    failed(false);
    try {
      // Os filtros correntes viajam junto: paginar não pode trocar o recorte.
      const params = new URLSearchParams({ cursor: next });
      if (input.filters.search) params.set('search', input.filters.search);
      if (input.filters.status) params.set('status', input.filters.status);

      const page = await listContainers(undefined, params);
      items([...items(), ...page.data.map((c) => toRow(c, input.locale))]);
      cursor(page.next_cursor);
    } catch {
      failed(true);
    } finally {
      loadingMore(false);
    }
  }

  return {
    t: input.t,
    boundary: input.boundary,
    items,
    filters: input.filters,
    statusOptions: input.statusOptions,
    canCreate: input.canCreate,
    newHref: input.newHref,
    hasMore: () => cursor() !== undefined,
    isLoadingMore: loadingMore,
    errorMessage: () => (failed() ? input.boundary.loadError : undefined),
    loadMore: fetchNext,
    retry: fetchNext,
  };
}
