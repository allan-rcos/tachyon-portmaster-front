// Catálogo da rota /painel/perfis/@id/permissoes: texto do form (RoleForm em
// modo permissions) + chrome (título da lista e rótulo de sincronização).
import type { Locale } from '@/features/core/i18n/locale';
import type { RoleFormText } from '@/features/roles/islands/RoleForm.island';
import { roleFormMessages } from '@/features/roles/islands/RoleForm.messages';
import { m } from '@/paraglide/messages';

export type RolePermissionsText = RoleFormText & {
  title: string;
  subtitle: string;
  syncPermissions: string;
};

export const rolePermissionsMessages = (locale: Locale): RolePermissionsText => ({
  ...roleFormMessages(locale),
  title: m.roles_title({}, { locale }),
  subtitle: m.roles_subtitle({}, { locale }),
  syncPermissions: m.roles_sync_permissions({}, { locale }),
});
