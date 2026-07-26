import { ClientOnly } from '@view/core/components/ClientOnly';
import { Navbar } from '@view/core/components/Navbar';
import { Sidebar, type ShellNavText } from '@view/core/components/Sidebar';
import { LogoutButton } from '@view/core/islands/LogoutButton.island';
import type { ShellIdentity } from '@viewmodel/core/page/shell';
import type { JSX } from 'solid-js';

import styles from './AppShell.module.scss';

export interface AppShellProps {
  currentPath: string;
  nav: ShellNavText;
  /** Quem está logado — vem do `PageInput` da rota, via `pageContext.data`. */
  identity?: ShellIdentity;
  children: JSX.Element;
}

/** Chrome autenticado: sidebar + topo + conteúdo, sobre o backdrop
 *  "deep water". Sidebar vira drawer no mobile (html[data-drawer]). */
export function AppShell(props: AppShellProps): JSX.Element {
  return (
    <div class={styles.shell}>
      <Sidebar
        currentPath={props.currentPath}
        nav={props.nav}
        identity={props.identity}
        footer={
          <ClientOnly fallback={<a href="/entrar">{props.nav.logout}</a>}>
            <LogoutButton label={props.nav.logout} />
          </ClientOnly>
        }
      />
      <div class={styles.main}>
        <Navbar />
        <main class={styles.content}>{props.children}</main>
      </div>
    </div>
  );
}
