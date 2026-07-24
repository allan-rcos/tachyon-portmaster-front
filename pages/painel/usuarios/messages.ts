// Catálogo i18n da rota /painel/usuarios (lista).
import { commonText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import type { UserListText } from '@/features/users/components/UserList';
import { m } from '@/paraglide/messages';

export const usersListMessages = (locale: Locale): UserListText => ({
  ...commonText(locale),
  title: m.users_title({}, { locale }),
  subtitle: m.users_subtitle({}, { locale }),
  new: m.users_new({}, { locale }),
  name: m.users_name({}, { locale }),
  email: m.users_email({}, { locale }),
  roles: m.users_roles({}, { locale }),
});
