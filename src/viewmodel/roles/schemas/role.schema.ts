import { z } from 'zod';

/** Chaves de erro dos schemas de perfil (contrato local). */
export interface RoleSchemaText {
  nameShort: string;
  nameLong: string;
  permissionsRequired: string;
}

/** Modo do formulário — o nome só é editável na criação. */
export type RoleFormMode = 'create' | 'permissions';

/**
 * Schema do formulário de perfil.
 *
 * Recebe o texto de erro por parâmetro em vez de embuti-lo: é o que permite
 * a mesma regra de validação falar o idioma da requisição.
 *
 * O modo muda as REGRAS, nunca a FORMA: `name` continua declarado no modo
 * `permissions` (como texto livre, já que ali ele nem é enviado) porque o
 * formulário tem uma única forma de valores nos dois modos. Antes eram dois
 * schemas de formas diferentes, e a View reconciliava os dois com um cast —
 * que apagava a checagem inteira do slot de validação.
 *
 * @param mode Criação do perfil ou sincronização das permissões.
 * @param t    Mensagens de erro já resolvidas; omitir cai no pt-BR.
 */
export function createRoleSchema(mode: RoleFormMode, t?: RoleSchemaText) {
  return z.object({
    name:
      mode === 'create'
        ? z
            .string()
            .trim()
            .min(2, t?.nameShort ?? 'Nome muito curto')
            .max(60, t?.nameLong ?? 'Nome muito longo')
        : z.string(),
    // Era `z.enum(Permission)`. Não é mais: o catálogo de permissões vive no
    // backend, então validar o slug aqui só recriaria a lista fechada que o
    // contrato acabou de abrir — e rejeitaria, no cliente, uma permissão nova
    // que o servidor aceita. O que ainda é regra de formulário, e continua
    // valendo, é não submeter um perfil sem nenhuma permissão marcada.
    permissions: z
      .array(z.string())
      .min(1, t?.permissionsRequired ?? 'Selecione ao menos uma permissão'),
  });
}

export const roleSchema = createRoleSchema('create');
export const rolePermissionsSchema = createRoleSchema('permissions');

/** Corpo do POST de criação de perfil. */
export type RoleFormData = z.infer<typeof roleSchema>;
