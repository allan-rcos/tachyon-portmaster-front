import type { ShellNavText } from '@viewmodel/core/i18n/text-contracts';
import type { ShellIdentity } from '@viewmodel/core/page/shell';
import { For, Show, type JSX } from 'solid-js';

import { Brand } from './Brand';
import { Icon, type IconName } from './Icon';
import styles from './Sidebar.module.scss';

type NavKey = 'painel' | 'conteineres' | 'produtos' | 'usuarios' | 'perfis';

interface NavItem {
  key: NavKey;
  href: string;
  icon: IconName;
  /** Só ativo em match exato (evita destacar a visão geral nas sub-rotas). */
  exact?: boolean;
}

/** Operação — o trabalho do dia a dia. */
const OPERATION: NavItem[] = [
  { key: 'painel', href: '/painel', icon: 'painel', exact: true },
  { key: 'conteineres', href: '/painel/conteineres', icon: 'container' },
  { key: 'produtos', href: '/painel/produtos', icon: 'flask' },
];

/** Administração — quem pode o quê. Separado porque é outro público. */
const ADMINISTRATION: NavItem[] = [
  { key: 'usuarios', href: '/painel/usuarios', icon: 'users' },
  { key: 'perfis', href: '/painel/perfis', icon: 'shield' },
];

function isActive(current: string, href: string, exact = false): boolean {
  return current === href || (!exact && current.startsWith(href + '/'));
}

export interface SidebarProps {
  /** Caminho da rota atual — decide qual item fica marcado. */
  currentPath: string;
  nav: ShellNavText;
  /** Quem está logado, para o rodapé. Ausente antes de a sessão resolver. */
  identity?: ShellIdentity;
  /** Conteúdo extra no rodapé (o botão de sair). */
  footer?: JSX.Element;
}

/**
 * Barra lateral de navegação. HTML puro (SSR); vira drawer no mobile.
 *
 * Os itens vêm em dois grupos, como no protótipo: operação primeiro, e
 * administração sob um eyebrow — quem opera o pátio raramente mexe em perfis, e
 * separar diz isso sem precisar de texto.
 */
export function Sidebar(props: SidebarProps): JSX.Element {
  const item = (entry: NavItem) => (
    <li>
      <a
        class={styles.link}
        classList={{ [styles.active]: isActive(props.currentPath, entry.href, entry.exact) }}
        href={entry.href}
        aria-current={isActive(props.currentPath, entry.href, entry.exact) ? 'page' : undefined}
      >
        <Icon name={entry.icon} size={18} />
        <span>{props.nav[entry.key]}</span>
      </a>
    </li>
  );

  return (
    <aside id="app-sidebar" class={styles.sidebar}>
      <a class={styles.brandLink} href="/painel" aria-label="PortMaster — início">
        <Brand />
      </a>

      <nav class={styles.nav} aria-label="Navegação principal">
        <ul class={styles.list}>
          <For each={OPERATION}>{item}</For>
        </ul>

        <span class={styles.eyebrow}>{props.nav.administration}</span>
        <ul class={styles.list}>
          <For each={ADMINISTRATION}>{item}</For>
        </ul>
      </nav>

      <div class={styles.footer}>
        <Show
          when={props.identity}
          fallback={
            <a
              class={styles.link}
              classList={{ [styles.active]: isActive(props.currentPath, '/painel/conta') }}
              href="/painel/conta"
            >
              <Icon name="user" size={18} />
              <span>{props.nav.conta}</span>
            </a>
          }
        >
          {(identity) => (
            <a
              class={styles.account}
              classList={{ [styles.active]: isActive(props.currentPath, '/painel/conta') }}
              href={identity().href}
              aria-current={isActive(props.currentPath, '/painel/conta') ? 'page' : undefined}
            >
              <span class={styles.avatar} aria-hidden="true">
                {identity().initials}
              </span>
              <span class={styles.who}>
                <span class={styles.name}>{identity().name}</span>
                <span class={styles.role}>{identity().role}</span>
              </span>
            </a>
          )}
        </Show>
        {props.footer}
      </div>
    </aside>
  );
}

export type { ShellNavText };
