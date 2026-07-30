/**
 * Rota /painel/produtos — as duas metades do MVVM desta tela.
 *
 * • `createProductListPageInput` é o DATA: o papel de uma resposta de API
 *   JSON. Faz o trabalho de servidor (sessão, permissão, cookie, i18n, 1ª
 *   página) e devolve dado PURO e SERIALIZÁVEL — o Vike o atravessa com o
 *   `@brillout/json-serializer` para hidratar o cliente, então nada de
 *   função, signal ou instância de classe aqui dentro.
 *
 * • `createProductListVM` é a REATIVIDADE: signals e handlers nomeados,
 *   construído no `+Page` a partir daquele dado puro. Roda igual nos dois
 *   lados — no 1º load a partir do input desserializado, na navegação
 *   client-side a partir do input que o `+data` produziu no navegador.
 *
 * A tela (`ProductListScreen`) é stateless: só lê deste VM.
 *
 * @packageDocumentation
 */
import { Permission } from '@model/common';
import type { Product } from '@model/products/dto';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '@viewmodel/core/i18n/async-boundary.messages';
import { RISK_CLASS_LABEL, RISK_CLASS_TONE, type Tone } from '@viewmodel/core/i18n/labels';
import { resolveLocale, type Locale } from '@viewmodel/core/i18n/locale';
import { authorize, can } from '@viewmodel/core/page/authorize';
import { searchParams, type PageMeta, type PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { formatDensity } from '@viewmodel/core/utils/formatters';
import { signal } from 'alien-signals';

import { productsListMessages } from './i18n/product-list-page.messages';
import type { ProductListText } from './i18n/text-contracts';
import { listProducts } from './queries/list-products.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const PRODUCT_LIST_PERMISSIONS = [Permission.ProductRead] as const;

/** Permissões exigidas para criar um produto (habilitam o botão "novo"). */
const PRODUCT_CREATE_PERMISSIONS = [Permission.ProductCreate] as const;

/**
 * Uma linha da listagem, já em formato de apresentação.
 *
 * A View não recebe `Product` (o DTO) porque não teria o que fazer com ele além
 * de formatar — e formatar é decisão de apresentação, que pertence a esta
 * camada. Tudo aqui é string ou dado plano: o objeto atravessa a serialização
 * do Vike intacto.
 */
export interface ProductRowData {
  /** Id opaco base62, usado como chave de lista. */
  id: string;
  /** Nome do produto. */
  name: string;
  /** Densidade já formatada, com unidade (ex.: `'0,58 t/m³'`). */
  density: string;
  /** Classe de risco resolvida para rótulo + tom do selo. */
  risk: { label: string; tone: Tone };
  /** Destino do link de edição, montado aqui para a View não conhecer rotas. */
  editHref: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ProductListPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: ProductListText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  /** Primeira página, já formatada. */
  items: readonly ProductRowData[];
  /** Cursor da próxima página; ausente quando acabou. */
  nextCursor?: string;
  /** Permissão de criação, já avaliada. */
  canCreate: boolean;
  /** Destino do botão "novo produto". */
  newHref: string;
  /** Locale resolvido, para formatar as páginas seguintes igual à primeira. */
  locale: Locale;
}

/**
 * Converte o DTO do Model na linha que a tela desenha.
 *
 * @param p      Produto vindo do Model.
 * @param locale Locale da apresentação, resolvido do cookie do request.
 */
function toRow(p: Product, locale: Locale): ProductRowData {
  return {
    id: p.id,
    name: p.name,
    density: formatDensity(p.density, locale),
    risk: { label: RISK_CLASS_LABEL[p.risk_class], tone: RISK_CLASS_TONE[p.risk_class] },
    editHref: `/painel/produtos/${p.id}/editar`,
  };
}

/**
 * O trabalho de servidor da rota: sessão, permissão, i18n e primeira página.
 *
 * Chamado pelo `+data.ts`, que é quem conhece o Vike. Roda também no navegador
 * durante navegação client-side — daí não haver nada de `document` aqui.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `ProductRead`.
 */
export async function createProductListPageInput(
  request: PageRequest,
): Promise<ProductListPageInput> {
  const account = await authorize(request, PRODUCT_LIST_PERMISSIONS);
  const locale = resolveLocale(request.headers);
  const t = productsListMessages(locale);
  const page = await listProducts(request.headers, searchParams(request));

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    boundary: asyncBoundaryMessages(locale),
    items: page.data.map((p) => toRow(p, locale)),
    nextCursor: page.next_cursor,
    canCreate: can(account, PRODUCT_CREATE_PERMISSIONS),
    newHref: '/painel/produtos/nova',
    locale,
  };
}

/** Superfície reativa da listagem de produtos. */
export interface ProductListVM {
  /** Texto da tela. */
  t: ProductListText;
  /** Texto da fronteira de carregamento. */
  boundary: AsyncBoundaryText;
  /** Linhas acumuladas — cresce a cada `loadMore`. */
  items: () => readonly ProductRowData[];
  /** Permissão de criação, já avaliada no servidor. */
  canCreate: boolean;
  /** Destino do botão "novo produto". */
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
export function createProductListVM(input: ProductListPageInput): ProductListVM {
  const items = signal<readonly ProductRowData[]>(input.items);
  const cursor = signal<string | undefined>(input.nextCursor);
  const loadingMore = signal(false);
  const failed = signal(false);

  async function fetchNext(): Promise<void> {
    const next = cursor();
    if (next === undefined || loadingMore()) return;
    loadingMore(true);
    failed(false);
    try {
      // Sem headers: a paginação só acontece no navegador, onde o cookie viaja
      // sozinho. O servidor entrega apenas a primeira página.
      const page = await listProducts(undefined, new URLSearchParams({ cursor: next }));
      items([...items(), ...page.data.map((p) => toRow(p, input.locale))]);
      cursor(page.next_cursor);
    } catch {
      // O erro vira estado: a tela mostra a mensagem e oferece `retry`.
      failed(true);
    } finally {
      loadingMore(false);
    }
  }

  return {
    t: input.t,
    boundary: input.boundary,
    items,
    canCreate: input.canCreate,
    newHref: input.newHref,
    hasMore: () => cursor() !== undefined,
    isLoadingMore: loadingMore,
    errorMessage: () => (failed() ? input.boundary.loadError : undefined),
    loadMore: fetchNext,
    retry: fetchNext,
  };
}
