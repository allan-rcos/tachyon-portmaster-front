// ============================================================
//  Cola comum das telas assíncronas.
//
//  Toda tela de /painel repete o mesmo ritual: converter os sinais do ViewModel
//  em accessors do Solid e disparar a carga na montagem. Concentrar isso aqui
//  mantém cada tela com o que de fato lhe é próprio — a composição do layout.
// ============================================================
import { toAccessor } from '@view/core/observable/to-accessor';
import type { AsyncSignal, AsyncStatus } from '@viewmodel/core/observable/async-signal';
import { onMount, type Accessor } from 'solid-js';

/** Sinais de uma carga assíncrona, já no formato que o Solid rastreia. */
export interface ScreenBinding<T> {
  data: Accessor<T | undefined>;
  status: Accessor<AsyncStatus>;
}

/**
 * Liga um recurso assíncrono do ViewModel à reatividade do Solid e dispara a
 * carga quando a tela monta.
 *
 * `onMount` (e não uma chamada direta) porque só o navegador deve buscar: no
 * SSR o componente é avaliado, mas nunca montado — é o que mantém o servidor
 * sem trabalho de dados nestas rotas.
 *
 * @typeParam T Tipo do dado carregado.
 * @param resource Recurso observável exposto pelo ViewModel.
 * @param load     Ação que dispara a carga.
 */
export function createScreenBinding<T>(
  resource: AsyncSignal<T, []>,
  load: () => Promise<void>,
): ScreenBinding<T> {
  const data = toAccessor(resource.data);
  const status = toAccessor(resource.status);
  onMount(() => void load());
  return { data, status };
}
