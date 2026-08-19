import type { ShellIdentity, ShellNav, ShellNavItem } from '@viewmodel/core/page/shell';
import { For, Show, type JSX } from 'solid-js';

import { Brand } from './Brand';
import { Icon, type IconName } from './Icon';
import { LocaleSwitcher } from './LocaleSwitcher';
import styles from './Sidebar.module.scss';

/** Ícone de cada item, pela chave que o ViewModel entrega. */
const ICONS: Record<string, IconName> = {
  painel: 'painel',
  conteineres: 'container',
  produtos: 'flask',
  manifestos: 'clipboard',
  usuarios: 'users',
  perfis: 'shield',
};

export interface SidebarProps {
  /** Navegação já montada — rótulos, destinos e qual está ativo. */
  nav: ShellNav;
  /** Quem está logado, para o rodapé. Ausente antes de a sessão resolver. */
  identity?: ShellIdentity;
  /** Conteúdo extra no rodapé (o botão de sair). */
  footer?: JSX.Element;
}

/**
 * Barra lateral de navegação. HTML puro (SSR); vira drawer no mobile.
 *
 * Não monta rota nem sabe que existe idioma: recebe `href` e `active` prontos
 * do `shellNav`. Enquanto ela montava os caminhos, todo componente do chrome
 * precisava carregar um `locale` só para repassar ao construtor de href.
 *
 * Os itens vêm em dois grupos, como no protótipo: operação primeiro, e
 * administração sob um eyebrow — quem opera o pátio raramente mexe em perfis, e
 * separar diz isso sem precisar de texto.
 */
export function Sidebar(props: SidebarProps): JSX.Element {
  const item = (entry: ShellNavItem) => (
    <li>
      <a
        class={styles.link}
        classList={{ [styles.active]: entry.active }}
        href={entry.href}
        aria-current={entry.active ? 'page' : undefined}
      >
        <Icon name={ICONS[entry.key] ?? 'painel'} size={18} />
        <span>{entry.label}</span>
      </a>
    </li>
  );

  return (
    <aside id="app-sidebar" class={styles.sidebar}>
      <a class={styles.brandLink} href={props.nav.homeHref} aria-label="PortMaster — início">
        <Brand />
      </a>

      <nav class={styles.nav} aria-label="Navegação principal">
        <ul class={styles.list}>
          <For each={props.nav.operation}>{item}</For>
        </ul>

        <span class={styles.eyebrow}>{props.nav.administrationLabel}</span>
        <ul class={styles.list}>
          <For each={props.nav.administration}>{item}</For>
        </ul>
      </nav>

      <div class={styles.footer}>
        <LocaleSwitcher options={props.nav.locales} />
        <Show
          when={props.identity}
          fallback={
            <a
              class={styles.link}
              classList={{ [styles.active]: props.nav.accountActive }}
              href={props.nav.accountHref}
            >
              <Icon name="user" size={18} />
              <span>{props.nav.accountLabel}</span>
            </a>
          }
        >
          {(identity) => (
            <a
              class={styles.account}
              classList={{ [styles.active]: props.nav.accountActive }}
              href={identity().href}
              aria-current={props.nav.accountActive ? 'page' : undefined}
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
