// Catálogo da rota /painel/usuarios/nova: texto do form + chrome da página.
import type { Locale } from '@/features/core/i18n/locale';
import type { UserFormText } from '@/features/users/islands/UserForm.island';
import { userFormMessages } from '@/features/users/islands/UserForm.messages';
import { m } from '@/paraglide/messages';

export type UserNewText = UserFormText & { title: string; subtitle: string; new: string };

export const userNewMessages = (locale: Locale): UserNewText => ({
  ...userFormMessages(locale),
  title: m.users_title({}, { locale }),
  subtitle: m.users_subtitle({}, { locale }),
  new: m.users_new({}, { locale }),
});
