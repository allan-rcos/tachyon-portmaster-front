import { ClientOnly } from '@view/core/components/ClientOnly';
import { SidebarDrawer } from '@view/core/islands/SidebarDrawer.island';
import type { JSX } from 'solid-js';

import { Brand } from './Brand';
import styles from './Navbar.module.scss';

/**
 * Barra superior do mobile: hambúrguer do drawer + marca compacta.
 *
 * O seletor de tema saiu junto com o tema claro — o produto é escuro, não há o
 * que alternar.
 */
export interface NavbarProps {
  /** Destino da marca, já montado pelo `shellNav`. */
  homeHref: string;
}

export function Navbar(props: NavbarProps): JSX.Element {
  return (
    <header class={styles.header}>
      <div class={styles.left}>
        <ClientOnly fallback={<span />}>
          <SidebarDrawer />
        </ClientOnly>
        <a class={styles.brandMobile} href={props.homeHref} aria-label="PortMaster — início">
          <Brand compact />
        </a>
      </div>
    </header>
  );
}
