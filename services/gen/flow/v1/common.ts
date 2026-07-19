// ============================================================
//  DTOs proxy (JSON) — enums e tipos comuns. Espelham o
//  swagger/swagger.json. IDs são STRINGS base62 opacas no front
//  (o backend converte para i64 só na infra). Sem CLI `flatc`.
// ============================================================

export const CONTAINER_STATUS = ['Empty', 'Loading', 'Sealed', 'InTransit'] as const;
export type ContainerStatus = (typeof CONTAINER_STATUS)[number];

export const RISK_CLASS = [
  'Class1Explosives',
  'Class2Gases',
  'Class3FlammableLiquids',
  'Class4FlammableSolids',
  'Class5OxidizingSubstances',
  'Class6ToxicSubstances',
  'Class7RadioactiveMaterials',
  'Class8CorrosiveSubstances',
  'Class9Miscellaneous',
  'None'
] as const;
export type RiskClass = (typeof RISK_CLASS)[number];

export const TELEMETRY_EVENT = ['Create', 'Load', 'Unload', 'Seal', 'Dispatch'] as const;
export type TelemetryEvent = (typeof TELEMETRY_EVENT)[number];

export const PERMISSION = [
  'ProductRead',
  'ProductCreate',
  'ProductUpdate',
  'ProductDelete',
  'ContainerRead',
  'ContainerCreate',
  'ContainerUpdate',
  'ContainerDelete',
  'ContainerSeal',
  'ContainerDispatch',
  'ContainerSummary',
  'ManifestLoad',
  'ManifestUnload',
  'UserGet',
  'UserList',
  'UserCreate',
  'UserUpdate',
  'UserDelete',
  'UserChangePassword',
  'UserUpdateRoles',
  'RoleList',
  'RoleCreate',
  'RoleUpdatePermissions',
  'MetricsRead'
] as const;
export type Permission = (typeof PERMISSION)[number];

/** Resposta paginada por cursor (padrão do backend). */
export interface Paged<T> {
  data: T[];
  next_cursor?: string;
  total: number;
}

/** Garante id opaco como string (o backend pode devolver integer). */
export function toId(v: unknown): string {
  return String(v);
}
