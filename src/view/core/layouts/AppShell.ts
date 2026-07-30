import { Navbar } from '@view/core/components/Navbar';
import { Sidebar, type ShellNavText } from '@view/core/components/Sidebar';
import { LogoutButton } from '@view/core/islands/LogoutButton.island';
import type { Renderable } from '@view/core/types';
import type { ShellIdentity } from '@viewmodel/core/page/shell';
import { html, type TemplateResult } from 'lit';

import styles from './AppShell.module.scss';

export interface AppShellProps {
  currentPath: string;
  nav: ShellNavText;
  /** Quem está logado — vem do `PageInput` da rota, via `pageContext.data`. */
  identity?: ShellIdentity;
  children: Renderable;
}

/**
 * Chrome autenticado: sidebar + topo + conteúdo, sobre o backdrop
 * "deep water". Sidebar vira drawer no mobile (html[data-drawer]).
 *
 * O `clientOnly` que envolvia o botão de sair saiu: ele não tem estado nem
 * depende de API de navegador para RENDERIZAR (só para agir, no clique), então
 * pode vir no HTML do servidor como qualquer outro botão.
 */
export function AppShell(props: AppShellProps): TemplateResult {
  return html`<div class=${styles.shell}>
    ${Sidebar({
      currentPath: props.currentPath,
      nav: props.nav,
      identity: props.identity,
      footer: LogoutButton({ label: props.nav.logout }),
    })}
    <div class=${styles.main}>
      ${Navbar()}
      <main class=${styles.content}>${props.children}</main>
    </div>
  </div>`;
}
