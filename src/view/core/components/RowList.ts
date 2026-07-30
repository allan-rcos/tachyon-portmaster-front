import type { Renderable } from '@view/core/types';
import { html, nothing, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import styles from './RowList.module.scss';

export interface RowListProps<T> {
  /**
   * `grid-template-columns` das linhas E do cabeçalho — os dois compartilham a
   * mesma grade, que é o que alinha rótulo e valor.
   */
  columns: string;
  /** Rótulos do cabeçalho, na ordem das colunas. Some no mobile. */
  headers: readonly string[];
  items: readonly T[];
  /** Células de uma linha, na ordem das colunas. */
  children: (item: T) => Renderable;
  /**
   * Grade alternativa do mobile — `grid-template-columns` + `grid-template-areas`.
   * Sem ela a linha só encolhe; com ela, ela se reorganiza em folha.
   */
  mobile?: { columns: string; areas: string };
}

/**
 * Lista em linhas — o padrão de produtos e usuários.
 *
 * Não é `<table>`, e é de propósito: não há dado tabular a tabelar (nem
 * ordenação, nem seleção, nem coluna redimensionável). É uma lista com colunas
 * alinhadas, e o protótipo a desenha como um único cartão contendo linhas.
 *
 * As medidas de grade vêm por prop porque cada tela tem a sua: as do protótipo
 * estão registradas em `docs/guides/styling.md`.
 */
export function RowList<T>(props: RowListProps<T>): TemplateResult {
  return html`<div
    class=${styles.list}
    style=${styleMap({
      '--row-columns': props.columns,
      '--row-columns-mobile': props.mobile?.columns ?? props.columns,
      '--row-areas-mobile': props.mobile?.areas ?? 'none',
    })}
  >
    ${
      props.headers.length > 0
        ? html`<div class=${styles.head}>
            ${props.headers.map((label) => html`<span>${label}</span>`)}
          </div>`
        : nothing
    }
    ${props.items.map((item) => html`<div class=${styles.row}>${props.children(item)}</div>`)}
  </div>`;
}
