import type { ShellNavText } from '@view/core/components/Sidebar';
import { AppShell } from '@view/core/layouts/AppShell';
import type { IncomingHeaders } from '@viewmodel/core/client/api-client';
import { commonText, navText } from '@viewmodel/core/i18n/common';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import type { ShellIdentity } from '@viewmodel/core/page/shell';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

import '@view/core/styles/global.scss';

// Rotas públicas não recebem o chrome autenticado (sidebar/topo).
const PUBLIC = ['/entrar'];

function isPublic(path: string): boolean {
  return PUBLIC.some((p) => path === p || path.startsWith(p + '/'));
}

/** Layout raiz: injeta o CSS global e envolve as páginas autenticadas
 *  no AppShell (sidebar + topo). O login renderiza sem o chrome. */
export default function Layout(props: { children: JSX.Element }): JSX.Element {
  const pageContext = usePageContext();
  const headers = (pageContext as unknown as { headers?: IncomingHeaders | null }).headers;
  const locale = resolveLocale(headers ?? undefined);
  const nav: ShellNavText = { ...navText(locale), logout: commonText(locale).logout };
  // Mesma origem do `+Head`: o `PageInput` da rota. O layout não tem `+data`
  // próprio no Vike, mas enxerga o `data` da página que está sendo renderizada.
  const identity = (pageContext.data as { shell?: ShellIdentity } | undefined)?.shell;

  return (
    <Show when={!isPublic(pageContext.urlPathname)} fallback={props.children}>
      <AppShell currentPath={pageContext.urlPathname} nav={nav} identity={identity}>
        {props.children}
      </AppShell>
    </Show>
  );
}
