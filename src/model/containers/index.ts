/**
 * Contêineres e seus manifestos — o recurso central do PortMaster.
 * Cobre listagem paginada por cursor, detalhe, sumário de ocupação, telemetria e
 * as transições de ciclo de vida (selar, despachar).
 *
 * Segue a forma padrão do recurso: `api.ts` (funções que exigem um cliente),
 * `dto.ts` (só tipos e constantes) e `fbs.ts` (codecs FlatBuffers). A separação
 * não é cosmética — é ela que deixa o ViewModel consumir o vocabulário de dados
 * sem que nenhuma chamada de rede fique alcançável de lá.
 *
 * @packageDocumentation
 */
export * from './api';
export * from './dto';
