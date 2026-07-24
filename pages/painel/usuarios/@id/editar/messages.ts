// Catálogo da rota /painel/usuarios/@id/editar: texto do form (UserForm) +
// das ações administrativas (UserAdminActions) + chrome. Espalha commonText
// para expor delete/edit/cancel no tipo do `t`.
import { commonText, type CommonText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import type { UserFormText } from '@/features/users/islands/UserForm.island';
import { userFormMessages } from '@/features/users/islands/UserForm.messages';
import { m } from '@/paraglide/messages';

export type UserEditText = CommonText &
  UserFormText & {
    resetPassword: string;
    newPassword: string;
    passwordChanged: string;
    deleteConfirm: string;
    title: string;
    subtitle: string;
  };

export const userEditMessages = (locale: Locale): UserEditText => ({
  ...commonText(locale),
  ...userFormMessages(locale),
  resetPassword: m.users_reset_password({}, { locale }),
  newPassword: m.users_new_password({}, { locale }),
  passwordChanged: m.users_password_changed({}, { locale }),
  deleteConfirm: m.users_delete_confirm({}, { locale }),
  title: m.users_title({}, { locale }),
  subtitle: m.users_subtitle({}, { locale }),
});
