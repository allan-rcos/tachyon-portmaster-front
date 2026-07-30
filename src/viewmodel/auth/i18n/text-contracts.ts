/**
 * Contratos de texto do domínio de autenticação.
 * Ver `@viewmodel/products/i18n/text-contracts` para o porquê de o contrato
 * morar no ViewModel.
 *
 * @packageDocumentation
 */
import type { LoginSchemaText } from '@viewmodel/auth/schemas/login.schema';

/** Chaves de texto do formulário de login. */
export interface LoginFormText extends LoginSchemaText {
  email: string;
  password: string;
  invalid: string;
  submit: string;
}
