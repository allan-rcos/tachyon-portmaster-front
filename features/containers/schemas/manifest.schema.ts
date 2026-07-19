import { z } from 'zod';

import type { Messages } from '@/shared/i18n/messages/pt-BR';

export function createLoadItemSchema(t?: Messages) {
  return z.object({
    product_id: z.string().min(1, t?.productRequired ?? 'Selecione um produto'),
    quantity: z.coerce.number().positive(t?.quantityPositive ?? 'A quantidade deve ser positiva'),
  });
}

export const loadItemSchema = createLoadItemSchema();
export type LoadItemData = z.infer<typeof loadItemSchema>;
