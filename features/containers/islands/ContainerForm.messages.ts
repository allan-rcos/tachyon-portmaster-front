// Texto do formulário de contêiner (dono: o próprio form). Reusado por
// /conteineres/nova e /conteineres/@id/editar. Erros vêm de valText.
import type { ContainerFormText } from './ContainerForm.island';

import { commonText, valText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import { m } from '@/paraglide/messages';

export const containerFormMessages = (locale: Locale): ContainerFormText => ({
  ...commonText(locale),
  ...valText(locale),
  data: m.containers_data({}, { locale }),
  code: m.containers_code({}, { locale }),
  maxCapacity: m.containers_max_capacity({}, { locale }),
});
