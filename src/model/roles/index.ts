/**
 * Perfis de acesso e suas permissões. O conjunto de permissões é
 * substituído inteiro, nunca incrementado: é o que torna a matriz de permissões da
 * View um formulário comum em vez de um diff.
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
