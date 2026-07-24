import { PERMISSION } from 'tachyon-portmaster-sdk/common';
import { z } from 'zod';

/** Chaves de erro dos schemas de perfil (contrato local). */
export interface RoleSchemaText {
  nameShort: string;
  nameLong: string;
  permissionsRequired: string;
}

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

/** Só permissões (modo de sincronização de um perfil existente). */
export function createRolePermissionsSchema(t?: Pick<RoleSchemaText, 'permissionsRequired'>) {
  return z.object({
    permissions: z
      .array(z.enum(PERMISSION))
      .min(1, t?.permissionsRequired ?? 'Selecione ao menos uma permissão'),
  });
}

export const roleSchema = createRoleSchema();
export type RoleFormData = z.infer<typeof roleSchema>;
