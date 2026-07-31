/**
 * Texto do formulário de perfil (dono: o próprio form). Reusado por
 * /perfis/nova (mode=create) e /perfis/@id/permissoes (mode=permissions).
 *
 * @packageDocumentation
 */
import { commonText, valText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { RoleFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const roleFormMessages = (locale: Locale): RoleFormText => ({
  ...commonText(locale),
  ...valText(locale),
  name: m.roles_name({}, { locale }),
  permissions: m.roles_permissions({}, { locale }),
});
