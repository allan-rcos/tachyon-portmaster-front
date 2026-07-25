// ============================================================
//  Contratos de texto do domínio de usuários.
//  Ver `@viewmodel/products/i18n/text-contracts` para o porquê de o contrato
//  morar no ViewModel.
// ============================================================
import type { PasswordResetSchemaText, UserSchemaText } from '../schemas/user.schema';

/** Chaves de texto que a listagem de usuários consome. */
export interface UserListText {
  title: string;
  subtitle: string;
  new: string;
  name: string;
  email: string;
  roles: string;
  actions: string;
  edit: string;
  empty: string;
}

/** Chaves de texto do formulário de usuário (criação e edição). */
export interface UserFormText extends UserSchemaText {
  data: string;
  name: string;
  email: string;
  initialPassword: string;
  roles: string;
  submitError: string;
  create: string;
  save: string;
  cancel: string;
}

/** Chaves de texto das ações administrativas (reset de senha e exclusão). */
export interface UserAdminActionsText extends PasswordResetSchemaText {
  resetPassword: string;
  newPassword: string;
  passwordChanged: string;
  delete: string;
  deleteConfirm: string;
  cancel: string;
}
