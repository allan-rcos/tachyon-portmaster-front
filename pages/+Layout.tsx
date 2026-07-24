import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

import type { IncomingHeaders } from '@/features/core/api/client';
import { AppShell } from '@/features/core/components/AppShell';
import type { ShellNavText } from '@/features/core/components/Sidebar';
import { commonText, navText } from '@/features/core/i18n/common';
import { resolveLocale } from '@/features/core/i18n/locale';
import '@/pages/global.scss';

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
  return (
    <Show when={!isPublic(pageContext.urlPathname)} fallback={props.children}>
      <AppShell currentPath={pageContext.urlPathname} nav={nav}>
        {props.children}
      </AppShell>
    </Show>
  );
}
