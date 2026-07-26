import { RiskClass } from '@model/common';
import { positiveNumberField } from '@viewmodel/core/schemas/numeric-string';
import { z } from 'zod';

/** Chaves de erro que este schema consome (contrato local — a página resolve). */
export interface ProductSchemaText {
  nameShort: string;
  nameLong: string;
  densityPositive: string;
  densityFormat: string;
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
    density: positiveNumberField(
      t?.densityFormat ?? 'Informe um número, ex.: 0,58',
      t?.densityPositive ?? 'A densidade deve ser positiva',
    ),
    risk_class: z.enum(RiskClass),
  });
}

export const productSchema = createProductSchema();
export type ProductFormData = z.infer<typeof productSchema>;
