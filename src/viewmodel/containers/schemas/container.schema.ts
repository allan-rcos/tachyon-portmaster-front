import { z } from 'zod';

/** Chaves de erro dos schemas de contêiner (contrato local). */
export interface ContainerSchemaText {
  codeShort: string;
  codeLong: string;
  codeFormat: string;
  capacityPositive: string;
}

/**
 * Schema do registro de contêiner (código e capacidade).
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
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

/**
 * Schema da edição de contêiner — só a capacidade é editável.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
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
