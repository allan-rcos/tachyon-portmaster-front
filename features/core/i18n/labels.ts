// ============================================================
//  Rótulos pt-BR e "tom" (cor de badge) dos enums do domínio.
// ============================================================
import type {
  ContainerStatus,
  RiskClass,
  TelemetryEvent,
  Permission,
} from 'tachyon-portmaster-sdk/common';

export type Tone = 'gold' | 'sage' | 'teal' | 'orange' | 'danger' | 'neutral';

export const CONTAINER_STATUS_LABEL: Record<ContainerStatus, string> = {
  Empty: 'Vazio',
  Loading: 'Carregando',
  Sealed: 'Lacrado',
  InTransit: 'Em trânsito',
};

export const CONTAINER_STATUS_TONE: Record<ContainerStatus, Tone> = {
  Empty: 'neutral',
  Loading: 'gold',
  Sealed: 'sage',
  InTransit: 'teal',
};

export const RISK_CLASS_LABEL: Record<RiskClass, string> = {
  Class1Explosives: 'Classe 1 — Explosivos',
  Class2Gases: 'Classe 2 — Gases',
  Class3FlammableLiquids: 'Classe 3 — Líquidos inflamáveis',
  Class4FlammableSolids: 'Classe 4 — Sólidos inflamáveis',
  Class5OxidizingSubstances: 'Classe 5 — Oxidantes',
  Class6ToxicSubstances: 'Classe 6 — Tóxicos',
  Class7RadioactiveMaterials: 'Classe 7 — Radioativos',
  Class8CorrosiveSubstances: 'Classe 8 — Corrosivos',
  Class9Miscellaneous: 'Classe 9 — Diversos',
  None: 'Sem risco',
};

export const RISK_CLASS_TONE: Record<RiskClass, Tone> = {
  Class1Explosives: 'danger',
  Class2Gases: 'orange',
  Class3FlammableLiquids: 'orange',
  Class4FlammableSolids: 'orange',
  Class5OxidizingSubstances: 'gold',
  Class6ToxicSubstances: 'danger',
  Class7RadioactiveMaterials: 'danger',
  Class8CorrosiveSubstances: 'orange',
  Class9Miscellaneous: 'neutral',
  None: 'sage',
};

export const TELEMETRY_EVENT_LABEL: Record<TelemetryEvent, string> = {
  Create: 'Registro',
  Load: 'Carga',
  Unload: 'Descarga',
  Seal: 'Lacre',
  Dispatch: 'Despacho',
};

export const PERMISSION_LABEL: Record<Permission, string> = {
  ProductRead: 'Ver produtos',
  ProductCreate: 'Criar produtos',
  ProductUpdate: 'Editar produtos',
  ProductDelete: 'Excluir produtos',
  ContainerRead: 'Ver contêineres',
  ContainerCreate: 'Criar contêineres',
  ContainerUpdate: 'Editar contêineres',
  ContainerDelete: 'Excluir contêineres',
  ContainerSeal: 'Lacrar contêineres',
  ContainerDispatch: 'Despachar contêineres',
  ContainerSummary: 'Ver resumo de contêineres',
  ManifestLoad: 'Carregar manifesto',
  ManifestUnload: 'Descarregar manifesto',
  UserGet: 'Ver usuário',
  UserList: 'Listar usuários',
  UserCreate: 'Criar usuários',
  UserUpdate: 'Editar usuários',
  UserDelete: 'Excluir usuários',
  UserChangePassword: 'Alterar senha de usuários',
  UserUpdateRoles: 'Atribuir perfis',
  RoleList: 'Listar perfis',
  RoleCreate: 'Criar perfis',
  RoleUpdatePermissions: 'Editar permissões',
  MetricsRead: 'Ver métricas',
};

/** Agrupa permissões por recurso para a matriz de perfis. */
export const PERMISSION_GROUPS: { label: string; perms: Permission[] }[] = [
  { label: 'Produtos', perms: ['ProductRead', 'ProductCreate', 'ProductUpdate', 'ProductDelete'] },
  {
    label: 'Contêineres',
    perms: [
      'ContainerRead',
      'ContainerCreate',
      'ContainerUpdate',
      'ContainerDelete',
      'ContainerSeal',
      'ContainerDispatch',
      'ContainerSummary',
    ],
  },
  { label: 'Manifesto', perms: ['ManifestLoad', 'ManifestUnload'] },
  {
    label: 'Usuários',
    perms: [
      'UserGet',
      'UserList',
      'UserCreate',
      'UserUpdate',
      'UserDelete',
      'UserChangePassword',
      'UserUpdateRoles',
    ],
  },
  { label: 'Perfis', perms: ['RoleList', 'RoleCreate', 'RoleUpdatePermissions'] },
  { label: 'Métricas', perms: ['MetricsRead'] },
];
