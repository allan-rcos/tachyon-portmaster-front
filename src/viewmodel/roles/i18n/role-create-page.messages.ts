/**
 * Catálogo da rota /painel/perfis/nova: texto do form + chrome da página.
 *
 * @packageDocumentation
 */
import type { Locale } from '@viewmodel/core/i18n/locale';
import { roleFormMessages } from '@viewmodel/roles/i18n/role-form.messages';

import type { RoleFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export type RoleNewText = RoleFormText & { title: string; subtitle: string; new: string };

export const roleNewMessages = (locale: Locale): RoleNewText => ({
  ...roleFormMessages(locale),
  title: m.roles_title({}, { locale }),
  subtitle: m.roles_subtitle({}, { locale }),
  new: m.roles_new({}, { locale }),
});
