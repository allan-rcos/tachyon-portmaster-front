import { For, Show, type JSX } from 'solid-js';

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
  children: (item: T) => JSX.Element;
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
export function RowList<T>(props: RowListProps<T>): JSX.Element {
  return (
    <div
      class={styles.list}
      style={{
        '--row-columns': props.columns,
        '--row-columns-mobile': props.mobile?.columns ?? props.columns,
        '--row-areas-mobile': props.mobile?.areas ?? 'none',
      }}
    >
      <Show when={props.headers.length > 0}>
        <div class={styles.head}>
          <For each={props.headers}>{(label) => <span>{label}</span>}</For>
        </div>
      </Show>
      <For each={props.items}>
        {(item) => (
          <div class={styles.row}>
            {props.children(item)}
          </div>
        )}
      </For>
    </div>
  );
}
