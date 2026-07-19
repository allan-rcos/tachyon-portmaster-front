import { For, Show, type JSX } from 'solid-js';

import styles from './DataTable.module.scss';
import { Icon } from './Icon';

export interface Column<T> {
  header: string;
  cell: (row: T) => JSX.Element;
  /** Se definido, o cabeçalho vira link de ordenação (query params). */
  sortKey?: string;
  align?: 'start' | 'end';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
  /** Path base para os links de ordenação, ex.: `/painel/conteineres`. */
  basePath?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
}

/** Tabela SSR HTML puro. Ordenação por links `<a>` + query params. */
export function DataTable<T>(props: DataTableProps<T>): JSX.Element {
  const sortHref = (key: string) => {
    const nextDir = props.sort === key && props.dir === 'asc' ? 'desc' : 'asc';
    return `${props.basePath ?? ''}?sort=${key}&dir=${nextDir}`;
  };

  return (
    <div class={styles.wrap}>
      <table class={styles.table}>
        {props.caption && <caption class="srOnly">{props.caption}</caption>}
        <thead>
          <tr>
            <For each={props.columns}>
              {(col) => (
                <th data-align={col.align ?? 'start'}>
                  <Show when={col.sortKey && props.basePath} fallback={col.header}>
                    <a class={styles.sortLink} href={sortHref(col.sortKey!)}>
                      {col.header}
                      <Show when={props.sort === col.sortKey}>
                        <Icon
                          name={props.dir === 'desc' ? 'chevronDown' : 'chevronRight'}
                          size={14}
                        />
                      </Show>
                    </a>
                  </Show>
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={props.rows}>
            {(row) => (
              <tr class={styles.row}>
                <For each={props.columns}>
                  {(col) => <td data-align={col.align ?? 'start'}>{col.cell(row)}</td>}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
