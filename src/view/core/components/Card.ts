import type { Renderable } from '@view/core/types';
import { nothing, type TemplateResult } from 'lit';
import { html, literal, type StaticValue } from 'lit/static-html.js';

import styles from './Card.module.scss';

export interface CardProps {
  children: Renderable;
  title?: string;
  actions?: Renderable;
  class?: string;
  as?: 'article' | 'section';
  /**
   * Nível do heading do título do card. Default `h2` para manter a hierarquia
   * (a página começa em `h1` no PageHeader) — evita pular de h1 direto para h3.
   */
  headingLevel?: 'h2' | 'h3' | 'h4';
}

// O nome da tag entra no template, não num slot `${}`: é o que era `<Dynamic>`
// no Solid. Por isso vem do `lit/static-html.js`, e por isso o mapa é fechado —
// um `literal` é interpolado como código de template, então só pode vir de
// valor escrito aqui, nunca de props.
const WRAPPER: Record<NonNullable<CardProps['as']>, StaticValue> = {
  article: literal`article`,
  section: literal`section`,
};

const HEADING: Record<NonNullable<CardProps['headingLevel']>, StaticValue> = {
  h2: literal`h2`,
  h3: literal`h3`,
  h4: literal`h4`,
};

/** Painel de vidro (glass L1). HTML puro. */
export function Card(props: CardProps): TemplateResult {
  const wrapper = WRAPPER[props.as ?? 'article'];
  const heading = HEADING[props.headingLevel ?? 'h2'];

  return html`<${wrapper} class=${props.class ? `${styles.card} ${props.class}` : styles.card}>
    ${
      props.title || props.actions
        ? html`<header class=${styles.head}>
            ${props.title ? html`<${heading} class=${styles.title}>${props.title}</${heading}>` : nothing}
            ${props.actions ? html`<div class=${styles.actions}>${props.actions}</div>` : nothing}
          </header>`
        : nothing
    }
    ${props.children}
  </${wrapper}>`;
}
