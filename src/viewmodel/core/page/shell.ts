/**
 * Identidade que o chrome autenticado (sidebar) mostra no rodapé.
 *
 * Fica no `PageInput` — e não no layout — pela mesma razão que o `meta`: o
 * `+Layout` não tem `+data` próprio no Vike, mas enxerga `pageContext.data`.
 * Como TODA rota autenticada já chama `authorize()`, o perfil já está em mãos;
 * o que falta é entregá-lo em formato de apresentação.
 *
 * @packageDocumentation
 */
import type { AccountProfile } from '@model/account';
import { navText, commonText } from '@viewmodel/core/i18n/common';
import { LOCALES, splitLocale, switchLocale, type Locale } from '@viewmodel/core/i18n/locale';
import type { PageRequest } from '@viewmodel/core/page/page-request';

/** O que o rodapé da barra lateral desenha. Serializável. */
export interface ShellIdentity {
  /** Nome completo, exibido no rodapé. */
  name: string;
  /** Perfil principal, exibido abaixo do nome. */
  role: string;
  /** Iniciais para o avatar (no máximo duas letras). */
  initials: string;
  /** Destino do bloco — a própria conta. */
  href: string;
}

/**
 * Converte o perfil da sessão na identidade do chrome.
 *
 * @param account Perfil já carregado por `authorize`.
 * @param request Requisição — só para montar o destino pelo `href`, que já
 *   sabe o idioma. Sem isto o rodapé jogaria uma sessão em espanhol de volta
 *   para o português.
 */
export function shellIdentity(account: AccountProfile, request: PageRequest): ShellIdentity {
  const parts = account.name.trim().split(/\s+/).filter(Boolean);
  const first = parts.at(0)?.[0] ?? '';
  // Primeira e ÚLTIMA inicial, não as duas primeiras: "Ana Luiza Ferreira" vira
  // "AF", que é como as pessoas se reconhecem num avatar.
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';

  return {
    name: account.name,
    role: account.roles.at(0)?.name ?? '',
    initials: `${first}${last}`.toUpperCase(),
    href: request.href('/painel/conta'),
  };
}

/** Um item da navegação, pronto para desenhar. */
export interface ShellNavItem {
  /** Chave estável — a View a usa para escolher o ícone. */
  key: string;
  label: string;
  href: string;
  active: boolean;
}

/** Uma opção do seletor de idioma. */
export interface ShellLocaleOption {
  /** Rótulo curto (`PT`, `EN`, `ES`). */
  short: string;
  /** Nome do idioma no próprio idioma, para leitor de tela. */
  label: string;
  /** Tag BCP-47, para `lang`/`hreflang`. */
  tag: Locale;
  href: string;
  active: boolean;
}

/** Tudo que o chrome autenticado desenha. Nenhum href é montado na View. */
export interface ShellNav {
  operation: readonly ShellNavItem[];
  administration: readonly ShellNavItem[];
  /** Rótulo do grupo "administração". */
  administrationLabel: string;
  /** Destino da marca. */
  homeHref: string;
  /** Bloco da conta no rodapé (rótulo usado quando não há identidade). */
  accountLabel: string;
  accountHref: string;
  accountActive: boolean;
  logout: string;
  /** Destino do logout — a island navega, mas não monta rota. */
  logoutHref: string;
  locales: readonly ShellLocaleOption[];
}

const LOCALE_SHORT: Record<Locale, string> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' };
const LOCALE_LABEL: Record<Locale, string> = {
  'pt-BR': 'Português (Brasil)',
  en: 'English',
  es: 'Español',
};

/**
 * Monta a navegação do chrome.
 *
 * Mora aqui, e não na barra lateral, pela mesma razão que `listHref` mora no
 * ViewModel da listagem: a View não monta rota. Enquanto ela montava, todo
 * componente do chrome precisava carregar um `locale` só para repassá-lo ao
 * construtor de href — e o idioma vazava para `AppShell`, `Navbar` e até o
 * botão de sair, que não têm nada com isso.
 *
 * @param request Requisição — dá `href` (já no idioma) e a URL corrente.
 */
export function shellNav(request: PageRequest): ShellNav {
  const nav = request.t(navText);
  const common = request.t(commonText);
  const current = splitLocale(request.url).path;
  const active = (path: string, exact = false) =>
    current === path || (!exact && current.startsWith(path + '/'));

  const item = (key: string, path: string, exact = false): ShellNavItem => ({
    key,
    label: nav[key as keyof typeof nav],
    href: request.href(path),
    active: active(path, exact),
  });

  return {
    operation: [
      item('painel', '/painel', true),
      item('conteineres', '/painel/conteineres'),
      item('produtos', '/painel/produtos'),
      item('manifestos', '/painel/manifestos'),
    ],
    administration: [item('usuarios', '/painel/usuarios'), item('perfis', '/painel/perfis')],
    administrationLabel: nav.administration,
    homeHref: request.href('/painel'),
    accountLabel: nav.conta,
    accountHref: request.href('/painel/conta'),
    accountActive: active('/painel/conta'),
    logout: common.logout,
    logoutHref: request.href('/entrar'),
    locales: LOCALES.map((tag) => ({
      tag,
      short: LOCALE_SHORT[tag],
      label: LOCALE_LABEL[tag],
      href: switchLocale(request.url, tag),
      active: tag === request.t(),
    })),
  };
}
