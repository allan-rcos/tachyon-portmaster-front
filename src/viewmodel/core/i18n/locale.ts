// ============================================================
//  Resolução de locale (server-side). Lê o cookie `flow-locale`;
//  cai para pt-BR. Usado pelo `+data.ts` de cada rota junto de
//  `resolveMessages` (ver messages.ts).
// ============================================================
import { readHeader, type IncomingHeaders } from '@viewmodel/core/client/api-client';
import { parseCookies } from '@viewmodel/core/utils/cookies';

export type Locale = 'pt-BR' | 'en' | 'es';

const LOCALES: readonly Locale[] = ['pt-BR', 'en', 'es'];
export const DEFAULT_LOCALE: Locale = 'pt-BR';

export function resolveLocale(headers?: IncomingHeaders): Locale {
  const cookie = readHeader(headers, 'cookie');
  const wanted = parseCookies(cookie)['flow-locale'] as Locale | undefined;
  return wanted && LOCALES.includes(wanted) ? wanted : DEFAULT_LOCALE;
}
