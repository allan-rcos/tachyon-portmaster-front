import { Island } from '@view/core/island/island';
import type { Renderable } from '@view/core/types';
import { html, nothing } from 'lit';
import { ref } from 'lit/directives/ref.js';

import styles from './InfiniteList.island.module.scss';

export interface InfiniteListProps {
  /** Há mais páginas a carregar. */
  hasMore: boolean;
  /** Uma página adicional está em voo. */
  isLoading: boolean;
  /** Erro da última tentativa, se houve. */
  error?: string;
  /** Carrega a próxima página. Vem do ViewModel, já nomeado. */
  loadMore: () => Promise<void>;
  /** Repete a tentativa que falhou. */
  retry: () => Promise<void>;
  /** Rótulo do botão de carregar mais — também é o fallback sem JS. */
  loadMoreLabel: string;
  retryLabel: string;
}

/**
 * Rodapé de paginação por cursor: carrega a próxima página quando a sentinela
 * entra no viewport.
 *
 * O botão continua no HTML e não é decorativo — ele é o caminho quando não há
 * `IntersectionObserver` (ou JS). O observador só antecipa o clique.
 */
export class InfiniteList extends Island<InfiniteListProps> {
  #observer?: IntersectionObserver;

  /**
   * Campo, e não método: a diretiva `ref()` compara a identidade do callback
   * entre renders, e um método recriado a cada `template()` faria o observador
   * ser desligado e religado sem motivo. Recebe `undefined` quando a sentinela
   * sai da árvore.
   */
  #observe = (el: Element | undefined): void => {
    if (!el) {
      this.#observer?.disconnect();
      this.#observer = undefined;
      return;
    }
    if (typeof IntersectionObserver === 'undefined') return;

    this.#observer?.disconnect();
    this.#observer = new IntersectionObserver((entries) => {
      // `this.props` é lido dentro do callback, não na criação: assim o
      // observador enxerga o estado do momento em que a sentinela apareceu.
      if (!entries[0]?.isIntersecting) return;
      const { hasMore, isLoading, error, loadMore } = this.props;
      if (!hasMore || isLoading || error) return;
      void loadMore();
    });
    this.#observer.observe(el);
  };

  override dispose(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;
  }

  template(): Renderable {
    const props = this.props;

    return html`<div class=${styles.foot}>
      ${
        props.error
          ? html`<p class=${styles.error} role="alert">${props.error}</p>
              <button type="button" class=${styles.retry} @click=${() => void props.retry()}>
                ${props.retryLabel}
              </button>`
          : nothing
      }
      ${
        props.hasMore && !props.error
          ? html`<div ${ref(this.#observe)} class=${styles.sentinel} aria-hidden="true"></div>
              <button
                type="button"
                class=${styles.more}
                @click=${() => void props.loadMore()}
                ?disabled=${props.isLoading}
              >
                ${props.loadMoreLabel}
              </button>`
          : nothing
      }
    </div>`;
  }
}
