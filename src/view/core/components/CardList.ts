import type { Renderable } from '@view/core/types';
import { html, type TemplateResult } from 'lit';

import styles from './CardList.module.scss';

export interface CardListProps<T> {
  items: readonly T[];
  children: (item: T) => Renderable;
  /**
   * `grid` espalha os cartões em colunas de ~330px (contêineres); `column`
   * empilha (perfis). O protótipo usa as duas formas.
   */
  layout?: 'grid' | 'column';
}

/**
 * Lista de cartões — o padrão de contêineres e perfis.
 *
 * É só o container: o cartão em si é do domínio (`ContainerCard`, `RoleCard`),
 * porque o que ele mostra não se generaliza.
 */
export function CardList<T>(props: CardListProps<T>): TemplateResult {
  return html`<div class=${props.layout === 'column' ? styles.list : styles.grid}>
    ${props.items.map((item) => props.children(item))}
  </div>`;
}
