import { Island } from '@view/core/island/island';
import type { Renderable } from '@view/core/types';
import { AsyncDirective, directive, type DirectiveResult } from 'lit/async-directive.js';

/**
 * Monta um island dentro de um template.
 *
 * ```ts
 * html`${island(ConfirmDialog, { title: t.delete, onConfirm: () => del(id) })}`
 * ```
 *
 * O ponto todo é a **identidade**: o `lit-html` mantém uma instância de
 * diretiva por posição de template, então a instância do island é a mesma entre
 * re-renders da página — e o estado dela sobrevive. Sem isso, o effect raiz
 * recriaria o island (e zeraria os signals) a cada mudança em qualquer lugar da
 * tela.
 *
 * Como as props chegam por argumento e não por atributo de DOM, elas não
 * precisam ser serializáveis: callbacks e o próprio ViewModel passam inteiros.
 *
 * No SSR o `@lit-labs/ssr` chama só o `render()` da diretiva, então o island é
 * serializado com o estado inicial — o mesmo que o cliente terá ao hidratar.
 */
class IslandDirective extends AsyncDirective {
  #instance?: Island<unknown>;

  render<P>(Ctor: new (props: P) => Island<P>, props: P): Renderable {
    if (this.#instance) {
      (this.#instance as Island<P>).setProps(props);
    } else {
      this.#instance = new Ctor(props) as unknown as Island<unknown>;
    }
    return this.#instance.template();
  }

  protected override disconnected(): void {
    this.#instance?.dispose?.();
  }
}

export const island = directive(IslandDirective) as <P>(
  Ctor: new (props: P) => Island<P>,
  props: P,
) => DirectiveResult<typeof IslandDirective>;
