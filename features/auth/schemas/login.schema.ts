import { z } from 'zod';

/** Chaves de erro que este schema consome (contrato local). */
export interface LoginSchemaText {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}

export function createLoginSchema(t?: LoginSchemaText) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t?.emailRequired ?? 'Informe o e-mail')
      .email(t?.emailInvalid ?? 'E-mail inválido'),
    password: z.string().min(1, t?.passwordRequired ?? 'Informe a senha'),
  });
}

export const loginSchema = createLoginSchema();
export type LoginFormData = z.infer<typeof loginSchema>;
