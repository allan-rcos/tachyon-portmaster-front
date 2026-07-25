// ============================================================
//  Adapta o estado observável de uma mutação para a reatividade do Solid.
//  Um wrapper por formulário, e a JSX volta a ser declarativa: `isPending()`
//  em vez de assinar sinal na mão em cada island.
// ============================================================
import { toAccessor } from '@view/core/observable/to-accessor';
import type { MutationSignal } from '@viewmodel/core/observable/mutation-signal';
import type { Accessor } from 'solid-js';

/** Estado de uma mutação, já rastreável pelo Solid. */
export interface BoundMutation<TInput, TResult> {
  isPending: Accessor<boolean>;
  isError: Accessor<boolean>;
  isSuccess: Accessor<boolean>;
  error: Accessor<Error | undefined>;
  data: Accessor<TResult | undefined>;
  /** Executa a mutação. Não rejeita — o erro vira estado. */
  mutate: (input: TInput) => Promise<void>;
}

/**
 * Liga uma mutação do ViewModel à reatividade do Solid.
 *
 * @template TInput  Entrada da mutação.
 * @template TResult Retorno da mutação.
 * @param mutation Mutação observável criada pelo ViewModel.
 */
export function bindMutation<TInput, TResult>(
  mutation: MutationSignal<TInput, TResult>,
): BoundMutation<TInput, TResult> {
  return {
    isPending: toAccessor(mutation.isPending),
    isError: toAccessor(mutation.isError),
    isSuccess: toAccessor(mutation.isSuccess),
    error: toAccessor(mutation.error),
    data: toAccessor(mutation.data),
    mutate: mutation.mutate,
  };
}
