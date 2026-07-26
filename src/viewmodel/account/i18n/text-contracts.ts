// ============================================================
//  Contratos de texto do domínio de conta (perfil próprio).
//  Ver `@viewmodel/products/i18n/text-contracts` para o porquê de o contrato
//  morar no ViewModel.
// ============================================================
import type { AccountSchemaText, PasswordChangeSchemaText } from '@viewmodel/account/schemas/account.schema';

/** Chaves de texto do resumo do perfil próprio (SSR). */
export interface AccountProfileText {
  roles: string;
  name: string;
  email: string;
}

/** Chaves de texto do formulário de dados da conta. */
export interface AccountFormText extends AccountSchemaText {
  profile: string;
  name: string;
  email: string;
  submitError: string;
  save: string;
}

/** Chaves de texto da troca de senha. */
export interface PasswordChangeText extends PasswordChangeSchemaText {
  security: string;
  currentPassword: string;
  newPassword: string;
  submitError: string;
  passwordChanged: string;
  changePassword: string;
}
