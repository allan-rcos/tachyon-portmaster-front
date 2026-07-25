// Catálogo i18n da rota /painel/conta. Um único `t` alimenta o resumo
// (AccountProfile) e os dois forms (AccountForm, PasswordChange); cada um
// declara seu contrato local e consome o subconjunto que precisa.
import { commonText, valText, type CommonText, type ValText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import { m } from '@/paraglide/messages';

export type AccountPageText = CommonText &
  ValText & {
    title: string;
    subtitle: string;
    profile: string;
    roles: string;
    name: string;
    email: string;
    security: string;
    currentPassword: string;
    newPassword: string;
    changePassword: string;
    passwordChanged: string;
  };

export const accountMessages = (locale: Locale): AccountPageText => ({
  ...commonText(locale),
  ...valText(locale),
  title: m.account_title({}, { locale }),
  subtitle: m.account_subtitle({}, { locale }),
  profile: m.account_profile({}, { locale }),
  roles: m.account_roles({}, { locale }),
  name: m.account_name({}, { locale }),
  email: m.account_email({}, { locale }),
  security: m.account_security({}, { locale }),
  currentPassword: m.account_current_password({}, { locale }),
  newPassword: m.account_new_password({}, { locale }),
  changePassword: m.account_change_password({}, { locale }),
  passwordChanged: m.account_password_changed({}, { locale }),
});
