// Catálogo da rota /painel/conteineres/@id/editar: texto do form + chrome.
// `edit` vem de commonText (via containerFormMessages), reexposto no tipo.
import { containerFormMessages } from '@viewmodel/containers/i18n/container-form.messages';
import { commonText, type CommonText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { ContainerFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export type ContainerEditText = CommonText &
  ContainerFormText & { title: string; subtitle: string };

export const containerEditMessages = (locale: Locale): ContainerEditText => ({
  ...commonText(locale),
  ...containerFormMessages(locale),
  title: m.containers_title({}, { locale }),
  subtitle: m.containers_subtitle({}, { locale }),
});
