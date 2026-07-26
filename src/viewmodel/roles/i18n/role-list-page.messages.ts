// Catálogo i18n da rota /painel/perfis (lista).
import { commonText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { RoleListText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const rolesListMessages = (locale: Locale): RoleListText => ({
  eyebrow: m.roles_eyebrow({}, { locale }),
  permissionsCountLabel: m.roles_permissions_count_label({}, { locale }),
  userCountLabel: m.roles_user_count_label({}, { locale }),
  ...commonText(locale),
  title: m.roles_title({}, { locale }),
  subtitle: m.roles_subtitle({}, { locale }),
  new: m.roles_new({}, { locale }),
  name: m.roles_name({}, { locale }),
  userCount: m.roles_user_count({}, { locale }),
  permissions: m.roles_permissions({}, { locale }),
});
