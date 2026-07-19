import { z } from 'zod';

import { PERMISSION } from '@/services/gen/flow/v1/common';
import type { Messages } from '@/shared/i18n/messages/pt-BR';

export function createRoleSchema(t?: Messages) {
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
export function createRolePermissionsSchema(t?: Messages) {
  return z.object({
    permissions: z
      .array(z.enum(PERMISSION))
      .min(1, t?.permissionsRequired ?? 'Selecione ao menos uma permissão'),
  });
}

export const roleSchema = createRoleSchema();
export type RoleFormData = z.infer<typeof roleSchema>;
