import type { AsyncStatus } from '@viewmodel/core/observable/async-signal';
import { ErrorBoundary, Match, Switch, type JSX } from 'solid-js';

import styles from './AsyncBoundary.module.scss';

/** Estados que a fronteira sabe renderizar. */
export interface AsyncBoundaryProps<T> {
  /** Estado da carga, vindo do `AsyncSignal` do ViewModel. */
  status: AsyncStatus;
  /** Dado carregado; só é renderizado quando presente. */
  data: T | undefined;
  /** Placeholder exibido enquanto carrega. */
  fallback: JSX.Element;
  /** Mensagem de erro (i18n, resolvida pelo ViewModel). */
  errorMessage: string;
  /** Rótulo do botão de nova tentativa. */
  retryLabel: string;
  /** Ação de recarregar. */
  onRetry: () => void;
  /** Conteúdo, recebendo o dado já garantido como presente. */
  children: (data: T) => JSX.Element;
}

/**
 * Fronteira de carregamento para telas que buscam dados no navegador.
 *
 * Centraliza os três estados que toda tela de `/painel` precisa tratar —
 * carregando, erro (com nova tentativa) e sucesso — para que os componentes de
 * apresentação permaneçam puros, recebendo só o dado pronto.
 *
 * @template T Tipo do dado carregado.
 */
export function AsyncBoundary<T>(props: AsyncBoundaryProps<T>): JSX.Element {
  return (
    <ErrorBoundary fallback={<p class={styles.error}>{props.errorMessage}</p>}>
      <Switch fallback={props.fallback}>
        <Match when={props.status === 'error'}>
          <div class={styles.error} role="alert">
            <p>{props.errorMessage}</p>
            <button type="button" class={styles.retry} onClick={() => props.onRetry()}>
              {props.retryLabel}
            </button>
          </div>
        </Match>
        <Match when={props.data !== undefined}>{props.children(props.data as T)}</Match>
      </Switch>
    </ErrorBoundary>
  );
}
