// ============================================================
//  Estado observável de uma mutação (enviar formulário, excluir, lacrar…).
//
//  Substitui o `createMutation` do TanStack Query, que era usado só para
//  guardar "está enviando?" e "deu erro?" — estado de aplicação, portanto do
//  ViewModel. Manter uma segunda biblioteca de estado assíncrono ao lado dos
//  observables do VM significava duas fontes de verdade para a mesma pergunta.
//
//  `mutate` NUNCA rejeita: o erro vira estado observável. É o que evita
//  `unhandled rejection` em handler de submit e mantém a View declarativa.
// ============================================================
import { computed, signal } from 'alien-signals';

import type { AsyncStatus } from './async-signal';

/** Estado observável de uma mutação. */
export interface MutationSignal<TInput, TResult> {
  /** Estado da última execução. */
  status: () => AsyncStatus;
  /** Atalho para `status() === 'loading'`. */
  isPending: () => boolean;
  /** Atalho para `status() === 'error'`. */
  isError: () => boolean;
  /** Atalho para `status() === 'success'`. */
  isSuccess: () => boolean;
  /** Erro da última execução, se houve. */
  error: () => Error | undefined;
  /** Resultado da última execução bem-sucedida. */
  data: () => TResult | undefined;
  /** Executa a mutação. Não rejeita — o erro vira estado. */
  mutate: (input: TInput) => Promise<void>;
}

/** Callbacks opcionais do ciclo de vida da mutação. */
export interface MutationOptions<TResult> {
  /** Chamado após sucesso — navegação, reset de formulário, recarga. */
  onSuccess?: (result: TResult) => void;
}

/**
 * Cria o estado observável de uma mutação.
 *
 * @template TInput  Entrada da mutação (valores do formulário).
 * @template TResult Retorno da mutação.
 * @param mutation Função de mutação do ViewModel.
 * @param options  Callbacks de ciclo de vida.
 *
 * @example
 * ```ts
 * const save = createMutationSignal(
 *   (values: ProductFormData) => createProduct(values),
 *   { onSuccess: () => { window.location.href = '/painel/produtos'; } },
 * );
 * ```
 */
export function createMutationSignal<TInput, TResult>(
  mutation: (input: TInput) => Promise<TResult>,
  options: MutationOptions<TResult> = {},
): MutationSignal<TInput, TResult> {
  const status = signal<AsyncStatus>('idle');
  const error = signal<Error | undefined>(undefined);
  const data = signal<TResult | undefined>(undefined);

  const isPending = computed(() => status() === 'loading');
  const isError = computed(() => status() === 'error');
  const isSuccess = computed(() => status() === 'success');

  async function mutate(input: TInput): Promise<void> {
    status('loading');
    error(undefined);
    try {
      const result = await mutation(input);
      data(result);
      status('success');
      options.onSuccess?.(result);
    } catch (cause) {
      error(cause instanceof Error ? cause : new Error(String(cause)));
      status('error');
    }
  }

  return { status, isPending, isError, isSuccess, error, data, mutate };
}
