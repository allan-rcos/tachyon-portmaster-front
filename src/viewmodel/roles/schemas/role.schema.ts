import { PERMISSION } from '@model/common';
import { z } from 'zod';

/** Chaves de erro dos schemas de perfil (contrato local). */
export interface RoleSchemaText {
  nameShort: string;
  nameLong: string;
  permissionsRequired: string;
}

/**
 * Schema da criação de perfil (nome e permissões).
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createRoleSchema(t?: RoleSchemaText) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t?.nameShort ?? 'Nome muito curto')
      .max(60, t?.nameLong ?? 'Nome muito longo'),
    permissions: z
      .array(z.enum(PERMISSION))
      .min(1, t?.permissionsRequired ?? 'Selecione ao menos uma permissão'),
  });
}

/**
 * Schema da sincronização de permissões de um perfil existente.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * @param t Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createRolePermissionsSchema(t?: Pick<RoleSchemaText, 'permissionsRequired'>) {
  return z.object({
    permissions: z
      .array(z.enum(PERMISSION))
      .min(1, t?.permissionsRequired ?? 'Selecione ao menos uma permissão'),
  });
}

export const roleSchema = createRoleSchema();
export type RoleFormData = z.infer<typeof roleSchema>;
