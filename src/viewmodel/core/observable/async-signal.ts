// ============================================================
//  Recurso assíncrono observável — a peça sobre a qual todo ViewModel de tela
//  é construído.
//
//  Usa `alien-signals` em vez dos primitivos do Solid de propósito: é o que
//  mantém o ViewModel agnóstico de framework de interface. A ponte para o Solid
//  vive na View (`@view/core/observable/to-accessor`), num único arquivo.
//
//  Trata corrida de requisições: se `run` for chamado de novo antes da anterior
//  terminar, a resposta velha é descartada em vez de sobrescrever a nova. Sem
//  isso, digitar rápido num filtro deixa a tela mostrando o resultado errado.
// ============================================================
import { computed, signal } from 'alien-signals';

/** Estado do ciclo de vida de uma carga assíncrona. */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/** Recurso assíncrono observável. Todos os campos são getters reativos. */
export interface AsyncSignal<T, TArgs extends unknown[]> {
  /** Último valor carregado com sucesso, ou `undefined` antes da primeira carga. */
  data: () => T | undefined;
  /** Erro da última tentativa, se houve. */
  error: () => Error | undefined;
  /** Estado atual da carga. */
  status: () => AsyncStatus;
  /** Atalho para `status() === 'loading'`. */
  isLoading: () => boolean;
  /** Dispara (ou repete) a carga. Nunca rejeita — o erro vira estado. */
  run: (...args: TArgs) => Promise<void>;
}

/**
 * Cria um recurso assíncrono observável a partir de uma função de busca.
 *
 * @template T     Tipo do dado carregado.
 * @template TArgs Argumentos aceitos por `run`.
 * @param fetcher Função que busca o dado (uma query do ViewModel).
 * @param initial Valor inicial, quando existe um sensato (ex.: lista vazia).
 *
 * @example
 * ```ts
 * const products = createAsyncSignal((query?: URLSearchParams) => listProducts(undefined, query));
 * void products.run();
 * products.isLoading(); // true enquanto carrega
 * ```
 */
export function createAsyncSignal<T, TArgs extends unknown[] = []>(
  fetcher: (...args: TArgs) => Promise<T>,
  initial?: T,
): AsyncSignal<T, TArgs> {
  const data = signal<T | undefined>(initial);
  const error = signal<Error | undefined>(undefined);
  const status = signal<AsyncStatus>('idle');
  const isLoading = computed(() => status() === 'loading');

  // Só a chamada mais recente pode publicar seu resultado.
  let currentRun = 0;

  async function run(...args: TArgs): Promise<void> {
    const runId = ++currentRun;
    status('loading');
    error(undefined);
    try {
      const result = await fetcher(...args);
      if (runId !== currentRun) return;
      data(result);
      status('success');
    } catch (cause) {
      if (runId !== currentRun) return;
      error(cause instanceof Error ? cause : new Error(String(cause)));
      status('error');
    }
  }

  return { data, error, status, isLoading, run };
}
