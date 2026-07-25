import { SidebarDrawer } from '@view/core/islands/SidebarDrawer.island';
import { ThemeSwitcher } from '@view/core/islands/ThemeSwitcher.island';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';

import { Brand } from './Brand';
import styles from './Navbar.module.scss';


/** Barra superior: hambúrguer (mobile) + marca compacta + tema. */
export function Navbar(): JSX.Element {
  return (
    <header class={styles.header}>
      <div class={styles.left}>
        <ClientOnly fallback={<span />}>
          <SidebarDrawer />
        </ClientOnly>
        <a class={styles.brandMobile} href="/painel" aria-label="PortMaster — início">
          <Brand compact />
        </a>
      </div>
      <div class={styles.right}>
        <ClientOnly fallback={<span class={styles.themePlaceholder} />}>
          <ThemeSwitcher />
        </ClientOnly>
      </div>
    </header>
  );
}
