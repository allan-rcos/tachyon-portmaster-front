import { z } from 'zod';

/** Chaves de erro do schema de manifesto (contrato local). */
export interface LoadItemSchemaText {
  productRequired: string;
  quantityPositive: string;
}

/**
 * Schema de carga/descarga de item no manifesto.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createLoadItemSchema(t?: LoadItemSchemaText) {
  return z.object({
    product_id: z.string().min(1, t?.productRequired ?? 'Selecione um produto'),
    quantity: z.coerce.number().positive(t?.quantityPositive ?? 'A quantidade deve ser positiva'),
  });
}

export const loadItemSchema = createLoadItemSchema();
export type LoadItemData = z.infer<typeof loadItemSchema>;
