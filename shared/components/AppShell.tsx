import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

import styles from './AppShell.module.scss';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { LogoutButton } from '@/shared/islands/LogoutButton.island';

/** Chrome autenticado: sidebar + topo + conteúdo, sobre o backdrop
 *  "deep water". Sidebar vira drawer no mobile (html[data-drawer]). */
export function AppShell(props: {
  currentPath: string;
  nav: Messages;
  children: JSX.Element;
}): JSX.Element {
  return (
    <div class={styles.shell}>
      <Sidebar
        currentPath={props.currentPath}
        nav={props.nav}
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
