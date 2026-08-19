/**
 * Sessão: carrega o AccountProfile (via cookie → GET /account) UMA vez por
 * requisição e memoiza, para que o guard (auth + permissões) e os
 * carregadores de página que precisem do perfil compartilhem o mesmo fetch.
 *
 * A memoização é chaveada pelo objeto de `headers`, não pelo PageContext do
 * Vike: é o mesmo objeto durante todo o request (cada `toPageRequest` o
 * repassa por referência), então o compartilhamento continua valendo — e esta
 * camada deixa de conhecer o framework de roteamento.
 *
 * @packageDocumentation
 */
import { getAccount, type AccountProfile } from '@model/account';
import type { Permission } from '@model/common';
import { resolveClient } from '@viewmodel/core/client/api-client';
import type { PageRequest } from '@viewmodel/core/page/page-request';

const cache = new WeakMap<object, Promise<AccountProfile>>();

/**
 * Carrega o perfil da sessão, memoizado por requisição.
 *
 * O cliente vem de `resolveClient`, e não fixo em `serverClient`: este
 * carregador roda nos DOIS lados — o `+data` das rotas é declarado com
 * `env: { server: true, client: true }` em `pages/+config.js`. No navegador o
 * `serverClient` estava errado por dois motivos independentes:
 *
 *   • apontava para o loopback do Rust (`API_SERVER_URL`), cross-origin a
 *     partir do navegador e fora do proxy que serve `/api`;
 *   • mandava a credencial num header `Cookie` montado à mão, e `Cookie` é
 *     forbidden header name — o navegador o descarta em silêncio. A origem
 *     ainda era `document.cookie`, que por definição nunca enxerga o
 *     `auth_token`: ele é HttpOnly.
 *
 * O efeito era 401 em toda navegação client-side, que o `toPageInput` traduz
 * em redirect para `/entrar`. Com `resolveClient` o navegador cai no
 * `browserClient` (`/api` + `credentials: 'include'`) e o cookie HttpOnly
 * viaja sozinho, que é como o backend espera recebê-lo.
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

  const pending = getAccount(resolveClient(request.headers));
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
