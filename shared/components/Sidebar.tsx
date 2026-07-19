import { For, type JSX } from 'solid-js';

import { Brand } from './Brand';
import { Icon, type IconName } from './Icon';
import styles from './Sidebar.module.scss';

import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { cn } from '@/shared/utils/cn';

interface NavItem {
  key: string;
  href: string;
  icon: IconName;
  /** Só ativo em match exato (evita destacar a visão geral nas sub-rotas). */
  exact?: boolean;
}

const NAV: NavItem[] = [
  { key: 'painel', href: '/painel', icon: 'painel', exact: true },
  { key: 'conteineres', href: '/painel/conteineres', icon: 'container' },
  { key: 'produtos', href: '/painel/produtos', icon: 'flask' },
  { key: 'usuarios', href: '/painel/usuarios', icon: 'users' },
  { key: 'perfis', href: '/painel/perfis', icon: 'shield' },
];

function isActive(current: string, href: string, exact = false): boolean {
  return current === href || (!exact && current.startsWith(href + '/'));
}

/** Barra lateral de navegação. HTML puro (SSR); vira drawer no mobile. */
export function Sidebar(props: {
  currentPath: string;
  nav: Messages;
  footer?: JSX.Element;
}): JSX.Element {
  return (
    <aside id="app-sidebar" class={styles.sidebar}>
      <a class={styles.brandLink} href="/painel" aria-label="PortMaster — início">
        <Brand />
      </a>

      <nav class={styles.nav} aria-label="Navegação principal">
        <ul class={styles.list}>
          <For each={NAV}>
            {(item) => (
              <li>
                <a
                  class={cn(
                    styles.link,
                    isActive(props.currentPath, item.href, item.exact) && styles.active,
                  )}
                  href={item.href}
                  aria-current={
                    isActive(props.currentPath, item.href, item.exact) ? 'page' : undefined
                  }
                >
                  <Icon name={item.icon} size={18} />
                  <span>{props.nav[item.key]}</span>
                </a>
              </li>
            )}
          </For>
        </ul>
      </nav>

      <div class={styles.footer}>
        <a
          class={cn(styles.link, isActive(props.currentPath, '/painel/conta') && styles.active)}
          href="/painel/conta"
          aria-current={isActive(props.currentPath, '/painel/conta') ? 'page' : undefined}
        >
          <Icon name="user" size={18} />
          <span>{props.nav.conta}</span>
        </a>
        {props.footer}
      </div>
    </aside>
  );
}
