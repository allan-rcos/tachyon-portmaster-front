/**
 * Usuários administrados — criação, edição, remoção e reset de senha.
 * Distinto de {@link "src/model/account" | account}, que é o próprio usuário
 * autenticado.
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
