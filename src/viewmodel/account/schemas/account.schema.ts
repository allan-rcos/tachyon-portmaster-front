import { z } from 'zod';

/** Chaves de erro dos schemas de conta (contratos locais). */
export interface AccountSchemaText {
  nameShort: string;
  nameLong: string;
  emailRequired: string;
  emailInvalid: string;
}

export interface PasswordChangeSchemaText {
  currentPasswordRequired: string;
  passwordMin: string;
}

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

export function createPasswordChangeSchema(t?: PasswordChangeSchemaText) {
  return z.object({
    current_password: z.string().min(1, t?.currentPasswordRequired ?? 'Informe a senha atual'),
    new_password: z.string().min(6, t?.passwordMin ?? 'Mínimo de 6 caracteres'),
  });
}

export const accountSchema = createAccountSchema();
export const passwordChangeSchema = createPasswordChangeSchema();

export type AccountFormData = z.infer<typeof accountSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;
