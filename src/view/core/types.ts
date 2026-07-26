import type { TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';

/**
 * Qualquer valor que o `lit-html` sabe colocar num slot `${…}` de template.
 *
 * Ocupa o lugar do `JSX.Element` do Solid: é o tipo de retorno de todo
 * componente e o tipo da prop `children`.
 *
 * O `vike-lit` declara um tipo estruturalmente idêntico. A duplicação é de
 * propósito — o vocabulário de "o que é desenhável" vem do Lit, não da
 * integração de rota, e a View não deve importar `vike*` para se tipar (é a
 * mesma regra que o ESLint aplica aos imports). Sendo estrutural, os dois são
 * intercambiáveis sem que exista dependência entre eles.
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
