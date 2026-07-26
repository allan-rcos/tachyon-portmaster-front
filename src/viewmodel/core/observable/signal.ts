// ============================================================
//  Signal simples do ViewModel — estado local de tela, sem ciclo assíncrono.
//
//  Complementa `createAsyncSignal` (que carrega) e `createMutationSignal` (que
//  escreve): aqui é só um valor que muda, como a lista acumulada de uma
//  paginação por cursor ou um filtro selecionado.
//
//  Usa `alien-signals`, e não os primitivos do Solid, pelo mesmo motivo dos
//  outros dois: é o que mantém o ViewModel agnóstico de framework de interface.
//  A ponte para o Solid vive num único arquivo da View
//  (`@view/core/observable/to-accessor`).
// ============================================================
import { signal } from 'alien-signals';

/**
 * Valor observável com leitura por chamada e escrita por `.set`.
 *
 * É invocável (`items()`) para casar com o formato dos demais getters do
 * ViewModel — a View trata todos igual ao passar por `toAccessor`.
 */
export interface Signal<T> {
  (): T;
  /**
   * Escreve um novo valor.
   *
   * @param value Valor a guardar.
   */
  set(value: T): void;
}

/**
 * Cria um valor observável.
 *
 * @template T Tipo do valor.
 * @param initial Valor inicial.
 *
 * @example
 * ```ts
 * const items = createSignal<readonly Row[]>(input.items);
 * items.set([...items(), ...page.data.map(toRow)]);
 * ```
 */
export function createSignal<T>(initial: T): Signal<T> {
  const inner = signal(initial);
  const read = (() => inner()) as Signal<T>;
  read.set = (value: T) => inner(value);
  return read;
}
