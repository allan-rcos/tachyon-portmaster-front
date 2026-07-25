import { z } from 'zod';

/** Chaves de erro dos schemas de contêiner (contrato local). */
export interface ContainerSchemaText {
  codeShort: string;
  codeLong: string;
  codeFormat: string;
  capacityPositive: string;
}

export function createContainerCreateSchema(t?: ContainerSchemaText) {
  return z.object({
    code: z
      .string()
      .trim()
      .min(3, t?.codeShort ?? 'Código muito curto')
      .max(20, t?.codeLong ?? 'Código muito longo')
      .regex(/^[A-Za-z0-9-]+$/, t?.codeFormat ?? 'Use letras, números e hífen'),
    max_capacity: z.coerce
      .number()
      .positive(t?.capacityPositive ?? 'A capacidade deve ser positiva'),
  });
}

export function createContainerUpdateSchema(t?: Pick<ContainerSchemaText, 'capacityPositive'>) {
  return z.object({
    max_capacity: z.coerce
      .number()
      .positive(t?.capacityPositive ?? 'A capacidade deve ser positiva'),
  });
}

export const containerCreateSchema = createContainerCreateSchema();
export const containerUpdateSchema = createContainerUpdateSchema();

export type ContainerCreateData = z.infer<typeof containerCreateSchema>;
export type ContainerUpdateData = z.infer<typeof containerUpdateSchema>;
