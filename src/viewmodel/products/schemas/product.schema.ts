import { RISK_CLASS } from '@model/common';
import { z } from 'zod';

/** Chaves de erro que este schema consome (contrato local — a página resolve). */
export interface ProductSchemaText {
  nameShort: string;
  nameLong: string;
  densityPositive: string;
}

/**
 * Schema do cadastro/edição de produto.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createProductSchema(t?: ProductSchemaText) {
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
