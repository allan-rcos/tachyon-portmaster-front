/**
 * Catálogo de metadados do sistema — hoje, as permissões registradas.
 *
 * Existe porque as permissões deixaram de ser um conjunto fechado: cada use case
 * declara a sua no WorkerStart do backend, então o catálogo só existe em runtime
 * e este endpoint é a única forma de descobrir que slugs podem ser concedidos a
 * um perfil. Nenhuma lista equivalente pode viver no front sem envelhecer.
 *
 * Eventos de telemetria NÃO estão aqui de propósito: aqueles continuam um enum
 * fechado em `common.fbs`, ao lado de `ContainerStatus` e `RiskClass`.
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
