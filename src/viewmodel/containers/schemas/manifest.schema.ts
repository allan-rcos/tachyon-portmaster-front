import { z } from 'zod';

/** Chaves de erro do schema de manifesto (contrato local). */
export interface LoadItemSchemaText {
  productRequired: string;
  quantityPositive: string;
}

export function createLoadItemSchema(t?: LoadItemSchemaText) {
  return z.object({
    product_id: z.string().min(1, t?.productRequired ?? 'Selecione um produto'),
    quantity: z.coerce.number().positive(t?.quantityPositive ?? 'A quantidade deve ser positiva'),
  });
}

export const loadItemSchema = createLoadItemSchema();
export type LoadItemData = z.infer<typeof loadItemSchema>;
