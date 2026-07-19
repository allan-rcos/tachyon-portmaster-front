import { redirect } from 'vike/abort';
import type { GuardAsync } from 'vike/types';

import { serverCall } from '@/services/clients/server';
import { getAccount } from '@/services/codecs/flow/v1/account';

// Rotas públicas (sem auth). Todo o resto exige sessão.
const PUBLIC = ['/entrar'];

function readCookie(pageContext: Parameters<GuardAsync>[0]): string | undefined {
  const headers = pageContext.headers as Record<string, string> | null | undefined;
  const fromHeader = headers?.cookie ?? headers?.Cookie;
  if (fromHeader) return fromHeader;
  // Navegação client-side: não há headers de request; usa document.cookie.
  return typeof document !== 'undefined' ? document.cookie : undefined;
}

/** Auth server-side: encaminha o cookie ao backend (GET /account).
 *  401 → redireciona ao login. O backend valida o cookie `auth_token`
 *  (same-origin token). */
export const guard: GuardAsync = async (pageContext) => {
  const path = pageContext.urlPathname;
  if (PUBLIC.some((p) => path === p || path.startsWith(p + '/'))) return;

  const cookie = readCookie(pageContext);
  try {
    await serverCall(getAccount, {}, { cookie });
  } catch {
    throw redirect(`/entrar?redirect=${encodeURIComponent(path)}`);
  }
};
