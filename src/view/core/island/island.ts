import type { Renderable } from '@view/core/types';

/**
 * Base dos componentes interativos.
 *
 * Um island é a única coisa da View que guarda estado. Componentes de
 * apresentação são funções `(props) => Renderable` que executam e acabam; o
 * island é classe porque precisa de um lugar onde os `signal` sobrevivam entre
 * renders.
 *
 * Ele NÃO busca dados nem valida formulário — isso é do ViewModel. O que mora
 * aqui é estado de interface pura: um diálogo está aberto, um drawer está
 * visível, um observador de viewport está ligado.
 *
 * @template P Props que o island recebe do componente que o monta.
 */
export abstract class Island<P> {
  protected props: P;

  constructor(props: P) {
    this.props = props;
  }

  /** Recebe props novas sem perder o estado. Chamado pela diretiva `island()`. */
  setProps(props: P): void {
    this.props = props;
  }

  /** O markup do island. Ler um `signal` aqui é o que o torna reativo. */
  abstract template(): Renderable;

  /**
   * Limpeza — o que era `onCleanup` no Solid.
   *
   * Chamado quando o island sai da árvore. Remova aqui listeners de
   * `document`/`window` e observadores; o que está no próprio markup o
   * `lit-html` recolhe sozinho.
   */
  dispose?(): void;
}
