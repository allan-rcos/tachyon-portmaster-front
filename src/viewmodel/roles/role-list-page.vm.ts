/**
 * Rota /painel/perfis.
 *
 * Mesmo desenho de `@viewmodel/products/product-list-page.vm`, que documenta
 * os dois papéis (o `PageInput` como "data" serializável e o VM como
 * reatividade). Aqui só muda o recurso.
 *
 * @packageDocumentation
 */
import type { Role } from '@model/roles/dto';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '@viewmodel/core/i18n/async-boundary.messages';
import { permissionLabel } from '@viewmodel/core/i18n/labels';
import { resolveLocale, type Locale } from '@viewmodel/core/i18n/locale';
import { authorize, can } from '@viewmodel/core/page/authorize';
import { searchParams, type PageMeta, type PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { formatNumber } from '@viewmodel/core/utils/formatters';
import { signal } from 'alien-signals';

import { rolesListMessages } from './i18n/role-list-page.messages';
import type { RoleListText } from './i18n/text-contracts';
import { listRoles } from './queries/list-roles.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const ROLE_LIST_PERMISSIONS = ['role:list'] as const;

/**
 * Permissões exigidas para criar um perfil (habilitam o botão "novo").
 *
 * Repete o que a rota de criação declara, `permission:list` inclusive: o botão
 * só deve aparecer para quem a rota de destino vai deixar entrar.
 */
const ROLE_CREATE_PERMISSIONS = ['role:create', 'permission:list'] as const;

/** Uma linha da listagem, já em formato de apresentação. */
export interface RoleRowData {
  /** Id opaco base62, usado como chave de lista. */
  id: string;
  /** Nome do perfil. */
  name: string;
  /** Quantidade de usuários, já formatada. */
  userCount: string;
  /** Quantidade de permissões, já formatada. */
  permissionCount: string;
  /**
   * As permissões concedidas, com rótulo já traduzido — o cartão as mostra como
   * chips. A View recebe texto, não o enum: ver `@viewmodel/core/page/options`.
   */
  permissions: readonly string[];
  /** Destino da tela de permissões deste perfil. */
  permissionsHref: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface RoleListPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: RoleListText;
  /** Texto da fronteira de carregamento. */
  boundary: AsyncBoundaryText;
  /** Primeira página, já formatada. */
  items: readonly RoleRowData[];
  /** Cursor da próxima página; ausente quando acabou. */
  nextCursor?: string;
  /** Permissão de criação, já avaliada. */
  canCreate: boolean;
  /** Destino do botão "novo perfil". */
  newHref: string;
  /** Locale resolvido, para formatar as páginas seguintes igual à primeira. */
  locale: Locale;
}

/**
 * Converte o DTO do Model na linha que a tela desenha.
 *
 * @param r      Perfil vindo do Model.
 * @param locale Locale da apresentação.
 */
function toRow(r: Role, locale: Locale): RoleRowData {
  return {
    id: r.id,
    name: r.name,
    userCount: formatNumber(r.user_count, locale),
    permissionCount: formatNumber(r.permissions.length, locale),
    permissions: r.permissions.map(permissionLabel),
    permissionsHref: `/painel/perfis/${r.id}/permissoes`,
  };
}

/**
 * O trabalho de servidor da rota: sessão, permissão, i18n e primeira página.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `RoleList`.
 */
export async function createRoleListPageInput(request: PageRequest): Promise<RoleListPageInput> {
  const account = await authorize(request, ROLE_LIST_PERMISSIONS);
  const locale = resolveLocale(request.headers);
  const t = rolesListMessages(locale);
  const page = await listRoles(request.headers, searchParams(request));

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    boundary: asyncBoundaryMessages(locale),
    items: page.data.map((r) => toRow(r, locale)),
    nextCursor: page.next_cursor,
    canCreate: can(account, ROLE_CREATE_PERMISSIONS),
    newHref: '/painel/perfis/nova',
    locale,
  };
}

/** Superfície reativa da listagem de perfis. */
export interface RoleListVM {
  /** Texto da tela. */
  t: RoleListText;
  /** Texto da fronteira de carregamento. */
  boundary: AsyncBoundaryText;
  /** Linhas acumuladas — cresce a cada `loadMore`. */
  items: () => readonly RoleRowData[];
  /** Permissão de criação, já avaliada no servidor. */
  canCreate: boolean;
  /** Destino do botão "novo perfil". */
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
export function createRoleListVM(input: RoleListPageInput): RoleListVM {
  const items = signal<readonly RoleRowData[]>(input.items);
  const cursor = signal<string | undefined>(input.nextCursor);
  const loadingMore = signal(false);
  const failed = signal(false);

  async function fetchNext(): Promise<void> {
    const next = cursor();
    if (next === undefined || loadingMore()) return;
    loadingMore(true);
    failed(false);
    try {
      const page = await listRoles(undefined, new URLSearchParams({ cursor: next }));
      items([...items(), ...page.data.map((r) => toRow(r, input.locale))]);
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
    canCreate: input.canCreate,
    newHref: input.newHref,
    hasMore: () => cursor() !== undefined,
    isLoadingMore: loadingMore,
    errorMessage: () => (failed() ? input.boundary.loadError : undefined),
    loadMore: fetchNext,
    retry: fetchNext,
  };
}
