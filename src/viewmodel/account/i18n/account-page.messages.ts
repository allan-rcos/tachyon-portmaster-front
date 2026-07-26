// Catálogo i18n da rota /painel/conta. Um único `t` alimenta o resumo
// (AccountProfile) e os dois forms (AccountForm, PasswordChange); cada um
// declara seu contrato local e consome o subconjunto que precisa.
import { commonText, valText, type CommonText, type ValText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import { m } from '@/paraglide/messages';

export type AccountPageText = CommonText &
  ValText & {
    /** Linha de contexto em caixa alta, acima do título. */
    eyebrow: string;
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
    /**
     * Contagem de permissões de um perfil, já interpolada.
     *
     * É função, e não string, porque depende de um valor de runtime — é o
     * único caso do catálogo. Quem chama é o `createAccountPageInput`, que
     * resolve para string antes de a View ver: o `PageInput` continua
     * serializável.
     */
    permissionsCount: (count: number) => string;
  };

export const accountMessages = (locale: Locale): AccountPageText => ({
  eyebrow: m.account_eyebrow({}, { locale }),
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
  permissionsCount: (count: number) => m.account_permissions_count({ count }, { locale }),
});
