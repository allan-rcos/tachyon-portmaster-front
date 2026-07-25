// ============================================================
//  Contratos de texto do domínio de perfis (RBAC).
//  Ver `@viewmodel/products/i18n/text-contracts` para o porquê de o contrato
//  morar no ViewModel.
// ============================================================
import type { RoleSchemaText } from '../schemas/role.schema';

/** Chaves de texto que a listagem de perfis consome. */
export interface RoleListText {
  title: string;
  subtitle: string;
  new: string;
  name: string;
  userCount: string;
  permissions: string;
  actions: string;
  edit: string;
  empty: string;
}

/** Chaves de texto do formulário de perfil (criação e matriz de permissões). */
export interface RoleFormText extends RoleSchemaText {
  name: string;
  permissions: string;
  submitError: string;
  create: string;
  save: string;
  cancel: string;
}
