import { z } from 'zod';

import { RISK_CLASS } from '@/services/gen/flow/v1/common';
import type { Messages } from '@/shared/i18n/messages/pt-BR';

export function createProductSchema(t?: Messages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t?.nameShort ?? 'Nome muito curto')
      .max(120, t?.nameLong ?? 'Nome muito longo'),
    density: z.coerce.number().positive(t?.densityPositive ?? 'A densidade deve ser positiva'),
    risk_class: z.enum(RISK_CLASS),
  });
}

export const productSchema = createProductSchema();
export type ProductFormData = z.infer<typeof productSchema>;
