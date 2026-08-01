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

/** Chaves de erro que o schema de reset de senha consome. */
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

/** Modo do formulário — a senha inicial só existe na criação. */
export type UserFormMode = 'create' | 'edit';

/**
 * Schema do formulário de usuário.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * O modo muda as REGRAS, nunca a FORMA: `initial_password` continua declarado
 * na edição (como texto livre, já que ali ele nem é enviado) porque o
 * formulário tem uma única forma de valores nos dois modos. Antes eram dois
 * schemas de formas diferentes, e a View reconciliava os dois com um cast —
 * que apagava a checagem inteira do slot de validação.
 *
 * @param mode Criação ou edição.
 * @param t    Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createUserSchema(mode: UserFormMode, t?: UserSchemaText) {
  const m = msgs(t);
  return z.object({
    name: z.string().trim().min(2, m.nameShort).max(120, m.nameLong),
    // Ver a nota em `login.schema.ts`: o pipe mantém o trim antes do formato.
    email: z.string().trim().min(1, m.emailRequired).pipe(z.email(m.emailInvalid)),
    initial_password: mode === 'create' ? z.string().min(6, m.passwordMin) : z.string(),
    role_ids: z.array(z.string()).min(1, m.rolesRequired),
  });
}

/**
 * Schema do reset administrativo de senha.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createPasswordResetSchema(t?: PasswordResetSchemaText) {
  return z.object({
    new_password: z.string().min(6, t?.passwordMin ?? 'Mínimo de 6 caracteres'),
  });
}

// Versões estáticas (pt-BR) para server/testes.
export const userCreateSchema = createUserSchema('create');
export const userUpdateSchema = createUserSchema('edit');
export const passwordResetSchema = createPasswordResetSchema();

/** Corpo do POST de criação. */
export type UserCreateData = z.infer<typeof userCreateSchema>;
/** Corpo do PATCH — a senha não trafega na edição. */
export type UserUpdateData = Omit<UserCreateData, 'initial_password'>;
