// ============================================================
//  DTOs proxy (JSON) transversais — enums e tipos comuns. Espelham
//  o swagger/swagger.json. IDs são STRINGS base62 opacas no front
//  (o backend converte para i64 só na infra).
// ============================================================

// Enums como objeto `as const`, não `enum` do TS: o `enum` de string é
// NOMINAL, então `Permission` deixaria de aceitar a string crua vinda do JSON
// da API e exigiria cast em toda fronteira — além de não ser tree-shakeable.
// Este padrão dá o acesso namespaced (`Permission.ProductRead`) com o tipo
// ainda sendo a união de strings literais, que casa com o wire sem cast.
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

export const TelemetryEvent = {
  Create: 'Create',
  Load: 'Load',
  Unload: 'Unload',
  Seal: 'Seal',
  Dispatch: 'Dispatch',
} as const;
export type TelemetryEvent = (typeof TelemetryEvent)[keyof typeof TelemetryEvent];

export const Permission = {
  ProductRead: 'ProductRead',
  ProductCreate: 'ProductCreate',
  ProductUpdate: 'ProductUpdate',
  ProductDelete: 'ProductDelete',
  ContainerRead: 'ContainerRead',
  ContainerCreate: 'ContainerCreate',
  ContainerUpdate: 'ContainerUpdate',
  ContainerDelete: 'ContainerDelete',
  ContainerSeal: 'ContainerSeal',
  ContainerDispatch: 'ContainerDispatch',
  ContainerSummary: 'ContainerSummary',
  ManifestLoad: 'ManifestLoad',
  ManifestUnload: 'ManifestUnload',
  UserGet: 'UserGet',
  UserList: 'UserList',
  UserCreate: 'UserCreate',
  UserUpdate: 'UserUpdate',
  UserDelete: 'UserDelete',
  UserChangePassword: 'UserChangePassword',
  UserUpdateRoles: 'UserUpdateRoles',
  RoleList: 'RoleList',
  RoleCreate: 'RoleCreate',
  RoleUpdatePermissions: 'RoleUpdatePermissions',
  MetricsRead: 'MetricsRead',
} as const;
export type Permission = (typeof Permission)[keyof typeof Permission];

/** Resposta paginada por cursor (padrão do backend). */
export interface Paged<T> {
  data: T[];
  next_cursor?: string;
  total: number;
}
