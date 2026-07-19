import { z } from 'zod';

import type { Messages } from '@/shared/i18n/messages/pt-BR';

export function createLoginSchema(t?: Messages) {
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
