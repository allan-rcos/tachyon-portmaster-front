/**
 * DTOs proxy (JSON) transversais — enums e tipos comuns. Espelham
 * o swagger/swagger.json. IDs são STRINGS base62 opacas no front
 * (o backend converte para i64 só na infra).
 *
 * @packageDocumentation
 */
// Enums como objeto `as const`, não `enum` do TS: o `enum` de string é
// NOMINAL, então `RiskClass` deixaria de aceitar a string crua vinda do JSON
// da API e exigiria cast em toda fronteira — além de não ser tree-shakeable.
// Este padrão dá o acesso namespaced (`RiskClass.Class2Gases`) com o tipo
// ainda sendo a união de strings literais, que casa com o wire sem cast.
//
// Vale para os enums que o `.fbs` ainda fecha. `Permission` saiu dessa lista:
// virou catálogo de runtime, e o porquê está na própria declaração, lá embaixo.
//
// A ORDEM aqui é documental, não carrega significado: os valores numéricos do
// FlatBuffers vêm dos enums gerados pelo `flatc`, e é neles que
// `@model/core/fbs-runtime` faz o mapeamento. Não replicar índices à mão.

export const ContainerStatus = {
  Empty: 'Empty',
  Loading: 'Loading',
  Sealed: 'Sealed',
  InTransit: 'InTransit',
} as const;
export type ContainerStatus = (typeof ContainerStatus)[keyof typeof ContainerStatus];

export const RiskClass = {
  Class1Explosives: 'Class1Explosives',
  Class2Gases: 'Class2Gases',
  Class3FlammableLiquids: 'Class3FlammableLiquids',
  Class4FlammableSolids: 'Class4FlammableSolids',
  Class5OxidizingSubstances: 'Class5OxidizingSubstances',
  Class6ToxicSubstances: 'Class6ToxicSubstances',
  Class7RadioactiveMaterials: 'Class7RadioactiveMaterials',
  Class8CorrosiveSubstances: 'Class8CorrosiveSubstances',
  Class9Miscellaneous: 'Class9Miscellaneous',
  None: 'None',
} as const;
export type RiskClass = (typeof RiskClass)[keyof typeof RiskClass];

// Único enum cujo VALOR não é o nome do case: o contrato publica o evento em
// minúsculas (`load`), que é o texto guardado na coluna e o que o wire JSON
// entrega cru. A chave segue o case do `.fbs` para o acesso namespaced.
//
// Só `Load` e `Unload` existem: `Create`, `Seal` e `Dispatch` eram invenção do
// front — nunca estiveram no schema, e o backend descarta valor que não casa
// com nenhum case em vez de forçá-lo para um.
export const TelemetryEvent = {
  Load: 'load',
  Unload: 'unload',
} as const;
export type TelemetryEvent = (typeof TelemetryEvent)[keyof typeof TelemetryEvent];

/**
 * Slug de uma permissão, no formato `recurso:ação` (ex.: `product:create`).
 *
 * É `string` ABERTA, e isso é a mudança de contrato, não preguiça de tipagem: as
 * permissões deixaram de ser um enum do schema e viraram linhas de registro que
 * cada use case declara no WorkerStart do backend. O catálogo só existe em
 * runtime, e quem o publica é `GET /metadata/permissions` — qualquer união
 * fechada aqui seria uma cópia condenada a envelhecer em silêncio, concordando
 * com o compilador e discordando do servidor.
 *
 * O apelido existe para que a intenção continue legível nas assinaturas: um
 * `Permission[]` diz o que um `string[]` não diria.
 */
export type Permission = string;

/** Resposta paginada por cursor (padrão do backend). */
export interface Paged<T> {
  data: T[];
  next_cursor?: string;
  total: number;
}
