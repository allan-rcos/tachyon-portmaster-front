/**
 * A infraestrutura de island: a classe base `Island` e a diretiva `island()`
 * que a monta.
 *
 * O island é classe porque precisa de um lugar onde os `signal` sobrevivam entre
 * renders — componente de apresentação é função, executa e acaba. Ele **não** busca
 * dados nem valida formulário; isso é do ViewModel.
 *
 * Não confundir com {@link "src/view/core/islands" | islands}, no plural, que são
 * os interativos concretos.
 *
 * @packageDocumentation
 */
export * from './island';
export * from './mount';
