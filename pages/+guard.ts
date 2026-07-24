import type { Permission } from 'tachyon-portmaster-sdk/common';
import { redirect, render } from 'vike/abort';
import type { GuardAsync } from 'vike/types';

import { hasPermissions, loadAccount } from '@/features/core/auth/session';

// Rotas públicas (sem auth). Todo o resto exige sessão.
const PUBLIC = ['/entrar'];

function isPublic(path: string): boolean {
  return PUBLIC.some((p) => path === p || path.startsWith(p + '/'));
}

/**
 * Guard único que aplica auth + autorização por página. As permissões exigidas
 * são declaradas por página no value-file `+permissions.js` (config custom
 * `permissions`, resolução closest-wins — sem cascata indevida); aqui só lemos
 * `pageContext.config.permissions` da rota casada e conferimos.
 *
 *   • cookie inválido/ausente (401) → redirect ao login (fluxo preservado);
 *   • falta de permissão            → render(403) Forbidden (página _error).
 */
export const guard: GuardAsync = async (pageContext) => {
  if (isPublic(pageContext.urlPathname)) return;

  let account;
  try {
    account = await loadAccount(pageContext);
  } catch {
    throw redirect(`/entrar?redirect=${encodeURIComponent(pageContext.urlPathname)}`);
  }

  const required = ((pageContext.config as { permissions?: Permission[] }).permissions ??
    []) as Permission[];
  if (!hasPermissions(account, required)) throw render(403);
};
