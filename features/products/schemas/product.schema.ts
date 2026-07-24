import { RISK_CLASS } from 'tachyon-portmaster-sdk/common';
import { z } from 'zod';

/** Chaves de erro que este schema consome (contrato local — a página resolve). */
export interface ProductSchemaText {
  nameShort: string;
  nameLong: string;
  densityPositive: string;
}

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
