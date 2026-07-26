import { positiveNumberField } from '@viewmodel/core/schemas/numeric-string';
import { z } from 'zod';

/** Chaves de erro dos schemas de contêiner (contrato local). */
export interface ContainerSchemaText {
  codeShort: string;
  codeLong: string;
  codeFormat: string;
  capacityPositive: string;
  capacityFormat: string;
}

/** Modo do formulário — o código só é editável na criação. */
export type ContainerFormMode = 'create' | 'edit';

/**
 * Schema do formulário de contêiner.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * O modo muda as REGRAS, nunca a FORMA: `code` continua declarado na edição
 * (como texto livre, já que ali ele nem é enviado) porque o formulário tem uma
 * única forma de valores nos dois modos. Antes eram dois schemas de formas
 * diferentes, e a View reconciliava os dois com um cast — que apagava a
 * checagem inteira do slot de validação.
 *
 * @param mode Criação ou edição.
 * @param t    Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createContainerSchema(mode: ContainerFormMode, t?: ContainerSchemaText) {
  return z.object({
    code:
      mode === 'create'
        ? z
            .string()
            .trim()
            .min(3, t?.codeShort ?? 'Código muito curto')
            .max(20, t?.codeLong ?? 'Código muito longo')
            .regex(/^[A-Za-z0-9-]+$/, t?.codeFormat ?? 'Use letras, números e hífen')
        : z.string(),
    max_capacity: positiveNumberField(
      t?.capacityFormat ?? 'Informe a capacidade em kg, ex.: 24000',
      t?.capacityPositive ?? 'A capacidade deve ser positiva',
    ),
  });
}

export const containerCreateSchema = createContainerSchema('create');
export const containerUpdateSchema = createContainerSchema('edit');

/** Corpo do POST de criação. */
export type ContainerCreateData = z.infer<typeof containerCreateSchema>;
/** Corpo do PATCH — só a capacidade é editável. */
export type ContainerUpdateData = Pick<ContainerCreateData, 'max_capacity'>;
