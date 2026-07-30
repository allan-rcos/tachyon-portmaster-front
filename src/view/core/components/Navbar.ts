import { island } from '@view/core/island/mount';
import { SidebarDrawer } from '@view/core/islands/SidebarDrawer.island';
import { html, type TemplateResult } from 'lit';

import { Brand } from './Brand';
import styles from './Navbar.module.scss';

/**
 * Barra superior do mobile: hambúrguer do drawer + marca compacta.
 *
 * O `clientOnly` em volta do drawer saiu: o island renderiza igual nos dois
 * lados (fechado), e o listener de `Escape` só é registrado quando `document`
 * existe. O botão passa a vir no HTML da primeira requisição.
 *
 * O seletor de tema saiu junto com o tema claro — o produto é escuro, não há o
 * que alternar.
 */
export function Navbar(): TemplateResult {
  return html`<header class=${styles.header}>
    <div class=${styles.left}>
      ${island(SidebarDrawer, undefined)}
      <a class=${styles.brandMobile} href="/painel" aria-label="PortMaster — início">
        ${Brand({ compact: true })}
      </a>
    </div>
  </header>`;
}
