/**
 * Introspecção do servidor — o `GET /info` do backend.
 *
 * Substitui o `ProjectInfoDTO` + `json_encode` que morava no controller: a
 * resposta é uma tabela FlatBuffers declarada em `server.fbs` e publicada no
 * swagger, então nenhum endpoint existe fora do contrato.
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
