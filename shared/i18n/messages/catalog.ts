// ============================================================
//  Catálogo de mensagens — fonte única para o LinguiJS. Cada texto
//  do sistema é um descriptor `msg` (macro @lingui/core/macro); o
//  `lingui extract` varre este arquivo e gera os .po por locale.
//
//  Os componentes/islands NÃO usam macro no JSX: recebem o `t` já
//  resolvido (Record<string,string>) como prop, via loadMessages()
//  no +data.ts (server-side). Ver shared/i18n/server.ts.
// ============================================================
import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';

export type Descriptors = Record<string, MessageDescriptor>;

/** Namespace resolvido (strings prontas), passado como prop `t`. */
export type Messages = Record<string, string>;

const common = {
  appName: msg`PortMaster`,
  tagline: msg`bare metal, alive`,
  new: msg`Novo`,
  edit: msg`Editar`,
  delete: msg`Excluir`,
  save: msg`Salvar`,
  create: msg`Criar`,
  cancel: msg`Cancelar`,
  confirm: msg`Confirmar`,
  actions: msg`Ações`,
  search: msg`Buscar`,
  loading: msg`Carregando…`,
  empty: msg`Nada por aqui ainda.`,
  submitError: msg`Não foi possível concluir. Tente novamente.`,
  back: msg`Voltar`,
  logout: msg`Sair`,
  previous: msg`Anterior`,
  next: msg`Próximo`,
  // Mensagens de validação (Zod + i18n) — compartilhadas pelos formulários.
  nameShort: msg`Nome muito curto`,
  nameLong: msg`Nome muito longo`,
  emailRequired: msg`Informe o e-mail`,
  emailInvalid: msg`E-mail inválido`,
  passwordRequired: msg`Informe a senha`,
  passwordMin: msg`Mínimo de 6 caracteres`,
  currentPasswordRequired: msg`Informe a senha atual`,
  rolesRequired: msg`Selecione ao menos um perfil`,
  permissionsRequired: msg`Selecione ao menos uma permissão`,
  codeShort: msg`Código muito curto`,
  codeLong: msg`Código muito longo`,
  codeFormat: msg`Use letras, números e hífen`,
  capacityPositive: msg`A capacidade deve ser positiva`,
  densityPositive: msg`A densidade deve ser positiva`,
  quantityPositive: msg`A quantidade deve ser positiva`,
  productRequired: msg`Selecione um produto`,
} satisfies Descriptors;

const nav = {
  painel: msg`Painel`,
  conteineres: msg`Contêineres`,
  produtos: msg`Produtos`,
  usuarios: msg`Usuários`,
  perfis: msg`Perfis`,
  conta: msg`Conta`,
} satisfies Descriptors;

const auth = {
  title: msg`Entrar`,
  subtitle: msg`Acesse o pátio digital do porto.`,
  email: msg`E-mail`,
  password: msg`Senha`,
  submit: msg`Entrar`,
  invalid: msg`E-mail ou senha inválidos.`,
  script: msg`faster than the metal`,
} satisfies Descriptors;

const painel = {
  title: msg`Painel operacional`,
  subtitle: msg`Telemetria do pátio em tempo real.`,
  activeContainers: msg`Contêineres ativos`,
  totalContainers: msg`Total de contêineres`,
  yardLoad: msg`Ocupação do pátio`,
  registeredProducts: msg`Produtos no catálogo`,
  occupancy: msg`Divisão por status`,
  statusEmpty: msg`Vazio`,
  statusLoading: msg`Carregando`,
  statusSealed: msg`Lacrado`,
  statusInTransit: msg`Em trânsito`,
} satisfies Descriptors;

const containers = {
  title: msg`Contêineres`,
  subtitle: msg`Contêineres ativos e histórico do pátio.`,
  new: msg`Registrar contêiner`,
  code: msg`Código`,
  status: msg`Status`,
  weight: msg`Peso atual`,
  capacity: msg`Capacidade`,
  occupancy: msg`Ocupação`,
  summary: msg`Resumo do contêiner`,
  manifest: msg`Manifesto de carga`,
  logs: msg`Telemetria recente`,
  product: msg`Produto`,
  quantity: msg`Quantidade`,
  seal: msg`Lacrar`,
  dispatch: msg`Despachar`,
  load: msg`Carregar`,
  unload: msg`Descarregar`,
  emptyManifest: msg`Contêiner vazio. Nenhum produto carregado.`,
  sealConfirm: msg`Lacrar este contêiner? A carga não poderá mais ser alterada.`,
  dispatchConfirm: msg`Despachar este contêiner para transporte?`,
  deleteConfirm: msg`Remover este contêiner do porto?`,
  data: msg`Dados do contêiner`,
  maxCapacity: msg`Capacidade máxima (kg)`,
} satisfies Descriptors;

const products = {
  title: msg`Produtos`,
  subtitle: msg`Catálogo de produtos e classes de risco.`,
  new: msg`Cadastrar produto`,
  name: msg`Nome`,
  density: msg`Densidade`,
  riskClass: msg`Classe de risco`,
  data: msg`Dados do produto`,
  deleteConfirm: msg`Remover este produto do catálogo?`,
} satisfies Descriptors;

const users = {
  title: msg`Usuários`,
  subtitle: msg`Contas com acesso ao sistema.`,
  new: msg`Novo usuário`,
  name: msg`Nome`,
  email: msg`E-mail`,
  roles: msg`Perfis`,
  initialPassword: msg`Senha inicial`,
  resetPassword: msg`Redefinir senha`,
  newPassword: msg`Nova senha`,
  data: msg`Dados do usuário`,
  deleteConfirm: msg`Remover este usuário?`,
  passwordChanged: msg`Senha alterada com sucesso.`,
} satisfies Descriptors;

const roles = {
  title: msg`Perfis`,
  subtitle: msg`Perfis de acesso e permissões (RBAC).`,
  new: msg`Novo perfil`,
  name: msg`Nome do perfil`,
  permissions: msg`Permissões`,
  userCount: msg`Usuários`,
  data: msg`Dados do perfil`,
  syncPermissions: msg`Sincronizar permissões`,
} satisfies Descriptors;

const account = {
  title: msg`Minha conta`,
  subtitle: msg`Seus dados cadastrais e segurança.`,
  profile: msg`Perfil`,
  name: msg`Nome`,
  email: msg`E-mail`,
  roles: msg`Meus perfis`,
  security: msg`Segurança`,
  currentPassword: msg`Senha atual`,
  newPassword: msg`Nova senha`,
  changePassword: msg`Alterar senha`,
  passwordChanged: msg`Senha alterada com sucesso.`,
} satisfies Descriptors;

export const catalog = { common, nav, auth, painel, containers, products, users, roles, account };

export type Namespace = keyof typeof catalog;
