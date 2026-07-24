// Texto do formulário de usuário (dono: o próprio form). Reusado por
// /usuarios/nova e /usuarios/@id/editar. Erros vêm de valText.
import type { UserFormText } from './UserForm.island';

import { commonText, valText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import { m } from '@/paraglide/messages';

export const userFormMessages = (locale: Locale): UserFormText => ({
  ...commonText(locale),
  ...valText(locale),
  data: m.users_data({}, { locale }),
  name: m.users_name({}, { locale }),
  email: m.users_email({}, { locale }),
  initialPassword: m.users_initial_password({}, { locale }),
  roles: m.users_roles({}, { locale }),
});
