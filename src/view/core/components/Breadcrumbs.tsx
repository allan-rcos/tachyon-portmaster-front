import { For, type JSX } from 'solid-js';

import styles from './Breadcrumbs.module.scss';

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
}

/** Trilha de navegação. Presente em toda página autenticada. */
export function Breadcrumbs(props: BreadcrumbsProps): JSX.Element {
  return (
    <nav class={styles.nav} aria-label="Trilha de navegação">
      <ol class={styles.list}>
        <For each={props.items}>
          {(item, i) => (
            <li class={styles.item}>
              {item.href && i() < props.items.length - 1 ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
              {i() < props.items.length - 1 && (
                <span class={styles.sep} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
