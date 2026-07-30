import { Icon } from '@view/core/components/Icon';
import { Island } from '@view/core/island/island';
import { signal } from 'alien-signals';
import { html } from 'lit';

import styles from './SidebarDrawer.island.module.scss';

/**
 * Botão hambúrguer (mobile) que abre/fecha o drawer da sidebar via
 * `html[data-drawer]`. O AppShell reage a esse atributo no CSS.
 */
export class SidebarDrawer extends Island<void> {
  #open = signal(false);
  #onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.#set(false);
  };

  constructor(props: void) {
    super(props);
    // Só no navegador: o island é instanciado também no SSR, onde `document`
    // não existe e não há tecla a ouvir.
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.#onKey);
    }
  }

  #set(open: boolean): void {
    this.#open(open);
    document.documentElement.setAttribute('data-drawer', open ? 'open' : '');
  }

  override dispose(): void {
    document.removeEventListener('keydown', this.#onKey);
  }

  template() {
    const open = this.#open();
    return html`
      <button
        type="button"
        class=${styles.burger}
        aria-label="Menu"
        aria-expanded=${open}
        @click=${() => this.#set(!open)}
      >
        ${Icon({ name: open ? 'x' : 'menu', size: 20 })}
      </button>
      <div
        class=${styles.overlay}
        ?hidden=${!open}
        aria-hidden="true"
        @click=${() => this.#set(false)}
      ></div>
    `;
  }
}
