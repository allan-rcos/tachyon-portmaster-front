// ============================================================
//  Sessão server-side: carrega o AccountProfile (via cookie → GET /account)
//  UMA vez por request e memoiza, para que o guard (auth + permissões) e os
//  loaders que precisem do perfil compartilhem o mesmo fetch. Preserva o fluxo
//  de cookie/token existente — só acrescenta a leitura de permissões.
// ============================================================
import { getAccount, type AccountProfile } from 'tachyon-portmaster-sdk/account';
import type { Permission } from 'tachyon-portmaster-sdk/common';
import type { PageContext } from 'vike/types';

import { serverClient } from '@/features/core/api/client';

// Chaveado pelo objeto `pageContext` (um por request) — evita 2º fetch quando
// o guard raiz e um +data pedem o perfil no mesmo request.
const cache = new WeakMap<object, Promise<AccountProfile>>();

/** Cookie do request (SSR) ou `document.cookie` (navegação client-side). */
export function readCookie(pageContext: PageContext): string | undefined {
  const headers = pageContext.headers as Record<string, string> | null | undefined;
  const fromHeader = headers?.cookie ?? headers?.Cookie;
  if (fromHeader) return fromHeader;
  return typeof document !== 'undefined' ? document.cookie : undefined;
}

/** Perfil da sessão (memoizado por request). Lança se o cookie for inválido
 *  (401) — o chamador decide o redirect ao login. */
export function loadAccount(pageContext: PageContext): Promise<AccountProfile> {
  const cached = cache.get(pageContext);
  if (cached) return cached;
  const cookie = readCookie(pageContext);
  const pending = getAccount(serverClient({ cookie }));
  cache.set(pageContext, pending);
  return pending;
}

/** Conjunto efetivo de permissões (união dos perfis do usuário). */
export function grantedPermissions(account: AccountProfile): Set<Permission> {
  return new Set(account.roles.flatMap((r) => r.permissions));
}

/** true se o usuário possui TODAS as permissões exigidas. */
export function hasPermissions(account: AccountProfile, required: readonly Permission[]): boolean {
  if (required.length === 0) return true;
  const granted = grantedPermissions(account);
  return required.every((p) => granted.has(p));
}
