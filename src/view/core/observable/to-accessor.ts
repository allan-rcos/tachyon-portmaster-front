// ============================================================
//  Ponte alien-signals → Solid.
//
//  O ViewModel expõe observables de `alien-signals`, que o Solid não sabe
//  rastrear. Este é o ÚNICO ponto do projeto que conhece as duas bibliotecas —
//  é o preço, deliberado e contido, de manter o ViewModel independente do
//  framework de interface.
// ============================================================
import { effect } from 'alien-signals';
import { createSignal, onCleanup, type Accessor } from 'solid-js';

/**
 * Converte um getter reativo do `alien-signals` num accessor do Solid.
 *
 * O efeito é descartado junto do componente (`onCleanup`), então não há
 * assinatura vazada quando a tela é desmontada.
 *
 * @typeParam T Tipo do valor observado.
 * @param source Getter vindo do ViewModel.
 * @returns Accessor do Solid com o mesmo valor, reativo às mudanças.
 *
 * @example
 * ```tsx
 * const items = toAccessor(props.vm.products.data);
 * return <For each={items() ?? []}>{(p) => <li>{p.name}</li>}</For>;
 * ```
 */
export function toAccessor<T>(source: () => T): Accessor<T> {
  const [value, setValue] = createSignal<T>(source());
  // `setValue(() => v)`: o setter do Solid trata função como updater, então o
  // wrapper é o que permite guardar valores que sejam, eles mesmos, funções.
  const dispose = effect(() => {
    setValue(() => source());
  });
  onCleanup(dispose);
  return value;
}
