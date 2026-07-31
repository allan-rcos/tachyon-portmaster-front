/**
 * Catálogo da rota /entrar. Inclui o texto do LoginForm (form usado só por
 * esta rota) + o chrome do painel promocional. `valText` provê os erros.
 *
 * @packageDocumentation
 */
import { valText, type ValText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import { m } from '@/paraglide/messages';

export type LoginPageText = ValText & {
  title: string;
  subtitle: string;
  script: string;
  email: string;
  password: string;
  submit: string;
  invalid: string;
};

export const loginMessages = (locale: Locale): LoginPageText => ({
  ...valText(locale),
  title: m.auth_title({}, { locale }),
  subtitle: m.auth_subtitle({}, { locale }),
  script: m.auth_script({}, { locale }),
  email: m.auth_email({}, { locale }),
  password: m.auth_password({}, { locale }),
  submit: m.auth_submit({}, { locale }),
  invalid: m.auth_invalid({}, { locale }),
});
