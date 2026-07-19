import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

import { AppShell } from '@/shared/components/AppShell';
import ptBR from '@/shared/i18n/messages/pt-BR';
import '@/shared/global.scss';

// Rotas públicas não recebem o chrome autenticado (sidebar/topo).
const PUBLIC = ['/entrar'];

function isPublic(path: string): boolean {
  return PUBLIC.some((p) => path === p || path.startsWith(p + '/'));
}

/** Layout raiz: injeta o CSS global e envolve as páginas autenticadas
 *  no AppShell (sidebar + topo). O login renderiza sem o chrome. */
export default function Layout(props: { children: JSX.Element }): JSX.Element {
  const pageContext = usePageContext();
  return (
    <Show when={!isPublic(pageContext.urlPathname)} fallback={props.children}>
      <AppShell currentPath={pageContext.urlPathname} nav={ptBR.nav}>
        {props.children}
      </AppShell>
    </Show>
  );
}
