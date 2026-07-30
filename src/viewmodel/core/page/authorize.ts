/**
 * Autorização de rota, declarada pelo ViewModel da própria rota.
 *
 * Antes isto vivia em 15 arquivos `+permissions.js` lidos por um
 * `pages/+guard.ts`: a regra de acesso de uma tela ficava num arquivo do
 * framework de roteamento, longe do código que a implementa. Agora cada
 * `createXPageInput` começa chamando `authorize(request, [...])` e a permissão
 * fica ao lado do resto do trabalho de servidor da rota.
 *
 * @packageDocumentation
 */
import type { AccountProfile } from '@model/account';
import type { Permission } from '@model/common';
import { ForbiddenError, UnauthorizedError } from '@viewmodel/core/page/page-errors';
import type { PageRequest } from '@viewmodel/core/page/page-request';
import { grantedPermissions, loadAccount } from '@viewmodel/core/session/session';

/**
 * Carrega a sessão e exige as permissões da rota.
 *
 * O perfil é memoizado por requisição (ver `session`), então chamar isto em
 * toda rota não multiplica requisições ao backend.
 *
 * @param request  Requisição de página.
 * @param required Permissões exigidas; vazio significa "só exige sessão".
 * @throws {UnauthorizedError} Quando não há sessão válida.
 * @throws {ForbiddenError} Quando há sessão mas faltam permissões.
 */
export async function authorize(
  request: PageRequest,
  required: readonly Permission[] = [],
): Promise<AccountProfile> {
  let account: AccountProfile;
  try {
    account = await loadAccount(request);
  } catch {
    throw new UnauthorizedError();
  }

  if (required.length > 0) {
    const granted = grantedPermissions(account);
    const missing = required.filter((p) => !granted.has(p));
    if (missing.length > 0) throw new ForbiddenError(missing);
  }
  return account;
}

/**
 * Diz se a sessão possui todas as permissões — sem lançar.
 *
 * É o que alimenta os campos `can*` do `PageInput` (ex.: `canCreate`), para que
 * a View receba a decisão pronta em vez de reavaliar permissão no template.
 *
 * @param account  Perfil da sessão.
 * @param required Permissões a verificar.
 */
export function can(account: AccountProfile, required: readonly Permission[]): boolean {
  const granted = grantedPermissions(account);
  return required.every((p) => granted.has(p));
}
