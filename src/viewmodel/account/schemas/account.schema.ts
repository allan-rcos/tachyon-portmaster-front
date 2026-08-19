import { z } from 'zod';

/** Chaves de erro dos schemas de conta (contratos locais). */
export interface AccountSchemaText {
  nameShort: string;
  nameLong: string;
  emailRequired: string;
  emailInvalid: string;
}

/** Chaves de erro que o schema de troca de senha consome. */
export interface PasswordChangeSchemaText {
  currentPasswordRequired: string;
  passwordMin: string;
  passwordMismatch: string;
}

/**
 * Schema dos próprios dados da conta (nome e e-mail).
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createAccountSchema(t?: AccountSchemaText) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t?.nameShort ?? 'Nome muito curto')
      .max(120, t?.nameLong ?? 'Nome muito longo'),
    email: z
      .string()
      .trim()
      .min(1, t?.emailRequired ?? 'Informe o e-mail')
      .email(t?.emailInvalid ?? 'E-mail inválido'),
  });
}

/**
 * Schema da troca da própria senha.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createPasswordChangeSchema(t?: PasswordChangeSchemaText) {
  return z
    .object({
      current_password: z.string().min(1, t?.currentPasswordRequired ?? 'Informe a senha atual'),
      new_password: z.string().min(6, t?.passwordMin ?? 'Mínimo de 6 caracteres'),
      confirm_password: z.string(),
    })
    .refine((v) => v.new_password === v.confirm_password, {
      message: t?.passwordMismatch ?? 'As senhas não conferem',
      path: ['confirm_password'],
    });
}

export const accountSchema = createAccountSchema();
export const passwordChangeSchema = createPasswordChangeSchema();

export type AccountFormData = z.infer<typeof accountSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;
