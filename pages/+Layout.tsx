import { AppShell } from '@view/core/layouts/AppShell';
import { splitLocale } from '@viewmodel/core/i18n/locale';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import { shellNav, type ShellIdentity } from '@viewmodel/core/page/shell';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

import '@view/core/styles/global.scss';

// Rotas públicas não recebem o chrome autenticado (sidebar/topo).
const PUBLIC = ['/entrar'];

function isPublic(url: string): boolean {
  const { path } = splitLocale(url);
  return PUBLIC.some((p) => path === p || path.startsWith(p + '/'));
}

/** Layout raiz: injeta o CSS global e envolve as páginas autenticadas
 *  no AppShell (sidebar + topo). O login renderiza sem o chrome. */
export default function Layout(props: { children: JSX.Element }): JSX.Element {
  const pageContext = usePageContext();
  // Mesmo adaptador das rotas: é dele que saem `href` e `t` já amarrados ao
  // idioma da requisição, para o chrome não montar caminho nem carregar locale.
  const nav = () => shellNav(toPageRequest(pageContext));
  // Mesma origem do `+Head`: o `PageInput` da rota. O layout não tem `+data`
  // próprio no Vike, mas enxerga o `data` da página que está sendo renderizada.
  const identity = (pageContext.data as { shell?: ShellIdentity } | undefined)?.shell;

  return (
    <Show when={!isPublic(pageContext.urlOriginal)} fallback={props.children}>
      <AppShell nav={nav()} identity={identity}>
        {props.children}
      </AppShell>
    </Show>
  );
}
