/**
 * Rota /painel/usuarios.
 *
 * Mesmo desenho de `@viewmodel/products/product-list-page.vm`, que documenta
 * os dois papéis (o `PageInput` como "data" serializável e o VM como
 * reatividade). Aqui só muda o recurso.
 *
 * @packageDocumentation
 */
import type { UserAdmin } from '@model/users/dto';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '@viewmodel/core/i18n/async-boundary.messages';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize, can } from '@viewmodel/core/page/authorize';
import { type PageMeta, type PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { signal } from 'alien-signals';

import type { UserListText } from './i18n/text-contracts';
import { usersListMessages } from './i18n/user-list-page.messages';
import { listUsers, USERS_PAGE_SIZE } from './queries/list-users.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const USER_LIST_PERMISSIONS = ['user:list'] as const;

/** Permissões exigidas para criar um usuário (habilitam o botão "novo"). */
const USER_CREATE_PERMISSIONS = ['user:create'] as const;

/** Uma linha da listagem, já em formato de apresentação. */
export interface UserRowData {
  /** Id opaco base62, usado como chave de lista. */
  id: string;
  /** Nome do usuário. */
  name: string;
  /** E-mail do usuário. */
  email: string;
  /** Nomes dos perfis vinculados, prontos para virar selos. */
  roles: readonly string[];
  /** Destino do link de edição, montado aqui para a View não conhecer rotas. */
  editHref: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface UserListPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: UserListText;
  /** Texto da fronteira de carregamento. */
  boundary: AsyncBoundaryText;
  /** Primeira página, já formatada. */
  items: readonly UserRowData[];
  /**
   * Próxima página a pedir; ausente quando a atual veio incompleta.
   *
   * Número, e não cursor: `/users` pagina por `page`/`limit`. Sem `total` no
   * envelope, "veio uma página cheia" é o único sinal de que pode haver mais —
   * o preço é uma última requisição vazia quando o total é múltiplo exato do
   * tamanho de página.
   */
  nextPage?: number;
  /** Permissão de criação, já avaliada. */
  canCreate: boolean;
  /** Destino do botão "novo usuário". */
  newHref: string;
}

/**
 * Converte o DTO do Model na linha que a tela desenha.
 *
 * @param u Usuário vindo do Model.
 */
function toRow(u: UserAdmin): UserRowData {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    roles: u.roles.map((r) => r.name),
    editHref: `/painel/usuarios/${u.id}/editar`,
  };
}

/**
 * O trabalho de servidor da rota: sessão, permissão, i18n e primeira página.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `user:list`.
 */
export async function createUserListPageInput(request: PageRequest): Promise<UserListPageInput> {
  const account = await authorize(request, USER_LIST_PERMISSIONS);
  const locale = resolveLocale(request.headers);
  const t = usersListMessages(locale);
  const page = await listUsers(request.headers);

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    boundary: asyncBoundaryMessages(locale),
    items: page.data.map(toRow),
    nextPage: page.data.length < USERS_PAGE_SIZE ? undefined : 2,
    canCreate: can(account, USER_CREATE_PERMISSIONS),
    newHref: '/painel/usuarios/nova',
  };
}

/** Superfície reativa da listagem de usuários. */
export interface UserListVM {
  /** Texto da tela. */
  t: UserListText;
  /** Texto da fronteira de carregamento. */
  boundary: AsyncBoundaryText;
  /** Linhas acumuladas — cresce a cada `loadMore`. */
  items: () => readonly UserRowData[];
  /** Permissão de criação, já avaliada no servidor. */
  canCreate: boolean;
  /** Destino do botão "novo usuário". */
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
export function createUserListVM(input: UserListPageInput): UserListVM {
  const items = signal<readonly UserRowData[]>(input.items);
  const nextPage = signal<number | undefined>(input.nextPage);
  const loadingMore = signal(false);
  const failed = signal(false);

  async function fetchNext(): Promise<void> {
    const next = nextPage();
    if (next === undefined || loadingMore()) return;
    loadingMore(true);
    failed(false);
    try {
      // Sem headers: a paginação só acontece no navegador, onde o cookie viaja
      // sozinho. O servidor entrega apenas a primeira página.
      const page = await listUsers(undefined, next);
      items([...items(), ...page.data.map(toRow)]);
      nextPage(page.data.length < USERS_PAGE_SIZE ? undefined : next + 1);
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
    canCreate: input.canCreate,
    newHref: input.newHref,
    hasMore: () => nextPage() !== undefined,
    isLoadingMore: loadingMore,
    errorMessage: () => (failed() ? input.boundary.loadError : undefined),
    loadMore: fetchNext,
    retry: fetchNext,
  };
}
