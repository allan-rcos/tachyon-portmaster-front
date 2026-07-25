// Texto do formulário de contêiner (dono: o próprio form). Reusado por
// /conteineres/nova e /conteineres/@id/editar. Erros vêm de valText.

import { commonText, valText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { ContainerFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const containerFormMessages = (locale: Locale): ContainerFormText => ({
  ...commonText(locale),
  ...valText(locale),
  data: m.containers_data({}, { locale }),
  code: m.containers_code({}, { locale }),
  maxCapacity: m.containers_max_capacity({}, { locale }),
});
