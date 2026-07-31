/**
 * Catálogo i18n da rota /painel/usuarios (lista).
 *
 * @packageDocumentation
 */
import { commonText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { UserListText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const usersListMessages = (locale: Locale): UserListText => ({
  eyebrow: m.users_eyebrow({}, { locale }),
  ...commonText(locale),
  title: m.users_title({}, { locale }),
  subtitle: m.users_subtitle({}, { locale }),
  new: m.users_new({}, { locale }),
  name: m.users_name({}, { locale }),
  email: m.users_email({}, { locale }),
  roles: m.users_roles({}, { locale }),
});
