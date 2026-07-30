import type { Renderable } from '@view/core/types';
import type { ShellNavText } from '@viewmodel/core/i18n/text-contracts';
import type { ShellIdentity } from '@viewmodel/core/page/shell';
import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

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
  footer?: Renderable;
}

/**
 * Barra lateral de navegação. HTML puro (SSR); vira drawer no mobile.
 *
 * Os itens vêm em dois grupos, como no protótipo: operação primeiro, e
 * administração sob um eyebrow — quem opera o pátio raramente mexe em perfis, e
 * separar diz isso sem precisar de texto.
 */
export function Sidebar(props: SidebarProps): TemplateResult {
  const item = (entry: NavItem) => {
    const active = isActive(props.currentPath, entry.href, entry.exact);
    return html`<li>
      <a
        class=${classMap({ [styles.link]: true, [styles.active]: active })}
        href=${entry.href}
        aria-current=${ifDefined(active ? 'page' : undefined)}
      >
        ${Icon({ name: entry.icon, size: 18 })}
        <span>${props.nav[entry.key]}</span>
      </a>
    </li>`;
  };

  const accountActive = isActive(props.currentPath, '/painel/conta');
  const identity = props.identity;

  return html`<aside id="app-sidebar" class=${styles.sidebar}>
    <a class=${styles.brandLink} href="/painel" aria-label="PortMaster — início"> ${Brand()} </a>

    <nav class=${styles.nav} aria-label="Navegação principal">
      <ul class=${styles.list}>
        ${OPERATION.map(item)}
      </ul>

      <span class=${styles.eyebrow}>${props.nav.administration}</span>
      <ul class=${styles.list}>
        ${ADMINISTRATION.map(item)}
      </ul>
    </nav>

    <div class=${styles.footer}>
      ${
        identity
          ? html`<a
              class=${classMap({ [styles.account]: true, [styles.active]: accountActive })}
              href=${identity.href}
              aria-current=${ifDefined(accountActive ? 'page' : undefined)}
            >
              <span class=${styles.avatar} aria-hidden="true">${identity.initials}</span>
              <span class=${styles.who}>
                <span class=${styles.name}>${identity.name}</span>
                <span class=${styles.role}>${identity.role}</span>
              </span>
            </a>`
          : html`<a
              class=${classMap({ [styles.link]: true, [styles.active]: accountActive })}
              href="/painel/conta"
            >
              ${Icon({ name: 'user', size: 18 })}
              <span>${props.nav.conta}</span>
            </a>`
      }
      ${props.footer}
    </div>
  </aside>`;
}

export type { ShellNavText };
