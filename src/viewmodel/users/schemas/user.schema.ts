import { z } from 'zod';

/** Chaves de erro dos schemas de usuário (contratos locais). */
export interface UserSchemaText {
  nameShort: string;
  nameLong: string;
  emailRequired: string;
  emailInvalid: string;
  passwordMin: string;
  rolesRequired: string;
}

export interface PasswordResetSchemaText {
  passwordMin: string;
}

// Mensagens de validação com i18n (island recebe `t` do SSR). Fallback pt-BR.
function msgs(t?: UserSchemaText) {
  return {
    nameShort: t?.nameShort ?? 'Nome muito curto',
    nameLong: t?.nameLong ?? 'Nome muito longo',
    emailRequired: t?.emailRequired ?? 'Informe o e-mail',
    emailInvalid: t?.emailInvalid ?? 'E-mail inválido',
    passwordMin: t?.passwordMin ?? 'Mínimo de 6 caracteres',
    rolesRequired: t?.rolesRequired ?? 'Selecione ao menos um perfil',
  };
}

export function createUserCreateSchema(t?: UserSchemaText) {
  const m = msgs(t);
  return z.object({
    name: z.string().trim().min(2, m.nameShort).max(120, m.nameLong),
    email: z.string().trim().min(1, m.emailRequired).email(m.emailInvalid),
    initial_password: z.string().min(6, m.passwordMin),
    role_ids: z.array(z.string()).min(1, m.rolesRequired),
  });
}

export function createUserUpdateSchema(t?: UserSchemaText) {
  const m = msgs(t);
  return z.object({
    name: z.string().trim().min(2, m.nameShort).max(120, m.nameLong),
    email: z.string().trim().min(1, m.emailRequired).email(m.emailInvalid),
    role_ids: z.array(z.string()).min(1, m.rolesRequired),
  });
}

export function createPasswordResetSchema(t?: PasswordResetSchemaText) {
  return z.object({
    new_password: z.string().min(6, t?.passwordMin ?? 'Mínimo de 6 caracteres'),
  });
}

// Versões estáticas (pt-BR) para server/testes.
export const userCreateSchema = createUserCreateSchema();
export const userUpdateSchema = createUserUpdateSchema();
export const passwordResetSchema = createPasswordResetSchema();

export type UserCreateData = z.infer<typeof userCreateSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
