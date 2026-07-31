/**
 * Autenticação — login e encerramento de sessão. Devolve o cookie que
 * todos os outros recursos repassam; nenhuma decisão de permissão mora aqui (isso
 * é `@viewmodel/core/session`).
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
