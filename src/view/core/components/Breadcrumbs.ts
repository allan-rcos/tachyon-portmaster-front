import { html, nothing, type TemplateResult } from 'lit';

import styles from './Breadcrumbs.module.scss';

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
}

/** Trilha de navegação. Presente em toda página autenticada. */
export function Breadcrumbs(props: BreadcrumbsProps): TemplateResult {
  const last = props.items.length - 1;

  return html`<nav class=${styles.nav} aria-label="Trilha de navegação">
    <ol class=${styles.list}>
      ${props.items.map((item, i) => {
        const isLast = i === last;
        return html`<li class=${styles.item}>
          ${
            item.href && !isLast
              ? html`<a href=${item.href}>${item.label}</a>`
              : html`<span aria-current="page">${item.label}</span>`
          }
          ${isLast ? nothing : html`<span class=${styles.sep} aria-hidden="true">/</span>`}
        </li>`;
      })}
    </ol>
  </nav>`;
}
