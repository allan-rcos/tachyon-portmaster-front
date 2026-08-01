import { z } from 'zod';

/** Chaves de erro que este schema consome (contrato local). */
export interface LoginSchemaText {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}

/**
 * Schema das credenciais de login.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createLoginSchema(t?: LoginSchemaText) {
  return z.object({
    // Pipe, e não `z.email().trim()`: naquela forma o check de formato roda
    // ANTES do trim, e "  ana@x.com  " passaria a ser recusado.
    email: z
      .string()
      .trim()
      .min(1, t?.emailRequired ?? 'Informe o e-mail')
      .pipe(z.email(t?.emailInvalid ?? 'E-mail inválido')),
    password: z.string().min(1, t?.passwordRequired ?? 'Informe a senha'),
  });
}

export const loginSchema = createLoginSchema();
export type LoginFormData = z.infer<typeof loginSchema>;
