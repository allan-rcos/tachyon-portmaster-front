import type { TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';

/**
 * Qualquer valor que o `lit-html` sabe colocar num slot `${…}` de template.
 *
 * É o análogo do `JSX.Element` do Solid — e o motivo de ele existir aqui, e não
 * na View: quem define o vocabulário de "o que é desenhável" é a integração,
 * como no `vike-solid` (que importa `JSX` do `solid-js`).
 */
export type Renderable =
  | TemplateResult
  | DirectiveResult
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | readonly Renderable[];
