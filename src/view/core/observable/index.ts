/**
 * A ponte `alien-signals` → Solid, e o único lugar do projeto que conhece as
 * duas bibliotecas.
 *
 * O ViewModel expõe getters de `alien-signals`, que o Solid não rastreia;
 * {@link "src/view/core/observable/to-accessor" | toAccessor} os converte em
 * `Accessor`. É o preço — deliberado e contido a um arquivo — de manter o
 * ViewModel independente do framework de interface, e é exatamente o que o
 * branch em Lit não precisa ter.
 *
 * @packageDocumentation
 */
export * from './to-accessor';
