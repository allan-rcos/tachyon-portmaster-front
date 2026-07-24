// Catálogo da rota /painel/perfis/nova: texto do form + chrome da página.
import type { Locale } from '@/features/core/i18n/locale';
import type { RoleFormText } from '@/features/roles/islands/RoleForm.island';
import { roleFormMessages } from '@/features/roles/islands/RoleForm.messages';
import { m } from '@/paraglide/messages';

export type RoleNewText = RoleFormText & { title: string; subtitle: string; new: string };

export const roleNewMessages = (locale: Locale): RoleNewText => ({
  ...roleFormMessages(locale),
  title: m.roles_title({}, { locale }),
  subtitle: m.roles_subtitle({}, { locale }),
  new: m.roles_new({}, { locale }),
});
