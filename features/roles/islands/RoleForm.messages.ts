// Texto do formulário de perfil (dono: o próprio form). Reusado por
// /perfis/nova (mode=create) e /perfis/@id/permissoes (mode=permissions).
import type { RoleFormText } from './RoleForm.island';

import { commonText, valText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import { m } from '@/paraglide/messages';

export const roleFormMessages = (locale: Locale): RoleFormText => ({
  ...commonText(locale),
  ...valText(locale),
  name: m.roles_name({}, { locale }),
  permissions: m.roles_permissions({}, { locale }),
});
