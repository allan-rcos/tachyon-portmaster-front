import { html, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './FilterTabs.module.scss';

export interface FilterTab {
  label: string;
  /** Destino da aba — montado pelo ViewModel, com os outros filtros preservados. */
  href: string;
  selected: boolean;
}

export interface FilterTabsProps {
  tabs: readonly FilterTab[];
  /** Rótulo acessível do grupo (ex.: "Status"). */
  label: string;
}

/**
 * Abas de filtro em pílulas; a ativa é ouro sólido com texto ink.
 *
 * São **links**, não botões: o recorte vem renderizado do servidor, funciona
 * sem JS e a URL fica compartilhável. `aria-current="page"` é o que comunica a
 * seleção — a cor sozinha não serve.
 */
export function FilterTabs(props: FilterTabsProps): TemplateResult {
  return html`<nav class=${styles.tabs} aria-label=${props.label}>
    ${props.tabs.map(
      (tab) =>
        html`<a
          class=${classMap({ [styles.tab]: true, [styles.active]: tab.selected })}
          href=${tab.href}
          aria-current=${ifDefined(tab.selected ? 'page' : undefined)}
          >${tab.label}</a
        >`,
    )}
  </nav>`;
}
