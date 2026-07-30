/**
 * Layout raiz. Injeta o CSS global e envolve as rotas autenticadas no
 * {@link "src/view/core/layouts" | AppShell}; `/entrar` renderiza sem o chrome.
 *
 * É composição pura — a lista de rotas públicas é a única regra que mora aqui.
 *
 * @packageDocumentation
 */
import type { ShellNavText } from '@view/core/components/Sidebar';
import { AppShell } from '@view/core/layouts/AppShell';
import type { IncomingHeaders } from '@viewmodel/core/client/api-client';
import { commonText, navText } from '@viewmodel/core/i18n/common';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import type { ShellIdentity } from '@viewmodel/core/page/shell';
import type { PageContext } from 'vike/types';
import type { Renderable } from 'vike-lit/types';

import '@view/core/styles/global.scss';

// Rotas públicas não recebem o chrome autenticado (sidebar/topo).
const PUBLIC = ['/entrar'];

function isPublic(path: string): boolean {
  return PUBLIC.some((p) => path === p || path.startsWith(p + '/'));
}

/**
 * Layout raiz: injeta o CSS global e envolve as páginas autenticadas no
 * AppShell (sidebar + topo). O login renderiza sem o chrome.
 *
 * Recebe `pageContext` por argumento — não há `usePageContext()`.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 * @param children    O template da página.
 */
export default function Layout(pageContext: PageContext, children: Renderable): Renderable {
  if (isPublic(pageContext.urlPathname)) return children;

  const headers = (pageContext as unknown as { headers?: IncomingHeaders | null }).headers;
  const locale = resolveLocale(headers ?? undefined);
  const nav: ShellNavText = { ...navText(locale), logout: commonText(locale).logout };
  // Mesma origem do `<head>`: o `PageInput` da rota. O layout não tem `+data`
  // próprio no Vike, mas enxerga o `data` da página que está sendo renderizada.
  const identity = (pageContext.data as { shell?: ShellIdentity } | undefined)?.shell;

  return AppShell({ currentPath: pageContext.urlPathname, nav, identity, children });
}
