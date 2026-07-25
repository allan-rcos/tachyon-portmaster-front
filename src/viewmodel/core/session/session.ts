// ============================================================
//  Sessão server-side: carrega o AccountProfile (via cookie → GET /account)
//  UMA vez por request e memoiza, para que o guard (auth + permissões) e os
//  carregadores de página que precisem do perfil compartilhem o mesmo fetch.
//
//  A memoização é chaveada pelo objeto de `headers`, não pelo PageContext do
//  Vike: é o mesmo objeto durante todo o request (cada `toPageRequest` o
//  repassa por referência), então o compartilhamento continua valendo — e esta
//  camada deixa de conhecer o framework de roteamento.
// ============================================================
import { getAccount, type AccountProfile } from '@model/account';
import type { Permission } from '@model/common';
import { serverClient } from '@viewmodel/core/client/api-client';

import type { PageRequest } from '../page/page-request';

const cache = new WeakMap<object, Promise<AccountProfile>>();

/**
 * Lê o cookie da requisição (SSR) ou do documento (navegação no cliente).
 *
 * @param request Requisição de página.
 */
export function readCookie(request: PageRequest): string | undefined {
  const headers = request.headers as Record<string, string> | null | undefined;
  const fromHeader = headers?.cookie ?? headers?.Cookie;
  if (fromHeader) return fromHeader;
  return typeof document !== 'undefined' ? document.cookie : undefined;
}

/**
 * Carrega o perfil da sessão, memoizado por requisição.
 *
 * @param request Requisição de página.
 * @throws Se o cookie for inválido ou ausente (401). Quem chama decide o que
 *   fazer — o redirect ao login é decisão do composition root.
 */
export function loadAccount(request: PageRequest): Promise<AccountProfile> {
  const key =
    typeof request.headers === 'object' && request.headers !== null ? request.headers : undefined;
  const cached = key && cache.get(key);
  if (cached) return cached;

  const pending = getAccount(serverClient({ cookie: readCookie(request) }));
  if (key) cache.set(key, pending);
  return pending;
}

/**
 * Conjunto efetivo de permissões do usuário (união de todos os seus perfis).
 *
 * @param account Perfil da sessão.
 */
export function grantedPermissions(account: AccountProfile): Set<Permission> {
  return new Set(account.roles.flatMap((r) => r.permissions));
}

/**
 * Verifica se o usuário possui TODAS as permissões exigidas.
 *
 * @param account  Perfil da sessão.
 * @param required Permissões exigidas pela rota (vazio = só exige autenticação).
 */
export function hasPermissions(account: AccountProfile, required: readonly Permission[]): boolean {
  if (required.length === 0) return true;
  const granted = grantedPermissions(account);
  return required.every((p) => granted.has(p));
}
