import type { Renderable } from '@view/core/types';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './PageHeader.module.scss';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: Renderable;
}

/**
 * Cabeçalho de página: título + subtítulo + ação primária.
 *
 * O `<div>` sem classe agrupa título e subtítulo num único item flex do
 * `.bar` — não tem regra própria, por isso não tem classe.
 */
export function PageHeader(props: PageHeaderProps): TemplateResult {
  return html`<header class=${styles.bar}>
    <div>
      <h1 class=${styles.title}>${props.title}</h1>
      ${props.subtitle ? html`<p class=${styles.subtitle}>${props.subtitle}</p>` : nothing}
    </div>
    ${props.action ? html`<div class=${styles.action}>${props.action}</div>` : nothing}
  </header>`;
}
