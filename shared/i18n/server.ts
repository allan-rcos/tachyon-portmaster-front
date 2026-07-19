// ============================================================
//  i18n server-side (LinguiJS). `resolveLocale` lê o cookie
//  `flow-locale`; `loadMessages` resolve os descriptors `msg` do
//  catálogo para strings do locale ativo e devolve o namespace
//  mesclado com `common` — passado como prop `t` (nunca hooks no JSX).
//
//  Catálogos de tradução (en/es) ficam vazios até serem preenchidos;
//  o Lingui cai para a mensagem-fonte (pt-BR) automaticamente.
// ============================================================
import { setupI18n } from '@lingui/core';

import { catalog, type Messages, type Namespace } from './messages/catalog';

import type { IncomingHeaders } from '@/services/clients/server';
import { readHeader } from '@/services/clients/server';
import { parseCookies } from '@/shared/utils/cookies';

export type Locale = 'pt-BR' | 'en' | 'es';
export type { Messages, Namespace };

const LOCALES: readonly Locale[] = ['pt-BR', 'en', 'es'];
const DEFAULT_LOCALE: Locale = 'pt-BR';

// Traduções compiladas por locale (fonte: shared/i18n/locales/*/messages.po).
// Vazio → fallback para a mensagem-fonte pt-BR.
const CATALOGS: Record<Locale, Record<string, string>> = {
  'pt-BR': {},
  en: {},
  es: {},
};

export function resolveLocale(headers?: IncomingHeaders): Locale {
  const cookie = readHeader(headers, 'cookie');
  const wanted = parseCookies(cookie)['flow-locale'] as Locale | undefined;
  return wanted && LOCALES.includes(wanted) ? wanted : DEFAULT_LOCALE;
}

export function loadMessages(locale: Locale, ns: Namespace): Messages {
  // Uma instância i18n por request — o txiki é stateless.
  const i18n = setupI18n({ locale, messages: { [locale]: CATALOGS[locale] } });
  const merged = { ...catalog.common, ...catalog[ns] };
  const out: Messages = {};
  for (const [key, desc] of Object.entries(merged)) out[key] = i18n._(desc);
  return out;
}
