import { onCleanup, Show, type JSX } from 'solid-js';

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
export function InfiniteList(props: InfiniteListProps): JSX.Element {
  const observe = (el: HTMLDivElement) => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      // `props` é lido dentro do callback, não na criação: assim o observador
      // enxerga o estado do momento em que a sentinela apareceu.
      if (!entries[0]?.isIntersecting) return;
      if (!props.hasMore || props.isLoading || props.error) return;
      void props.loadMore();
    });

    observer.observe(el);
    onCleanup(() => observer.disconnect());
  };

  return (
    <div class={styles.foot}>
      <Show when={props.error}>
        {(message) => (
          <>
            <p class={styles.error} role="alert">
              {message()}
            </p>
            <button type="button" class={styles.retry} onClick={() => void props.retry()}>
              {props.retryLabel}
            </button>
          </>
        )}
      </Show>

      <Show when={props.hasMore && !props.error}>
        <div ref={observe} class={styles.sentinel} aria-hidden="true" />
        <button
          type="button"
          class={styles.more}
          onClick={() => void props.loadMore()}
          disabled={props.isLoading}
        >
          {props.loadMoreLabel}
        </button>
      </Show>
    </div>
  );
}
