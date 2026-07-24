// Catálogo da rota /painel/conteineres/@id/editar: texto do form + chrome.
// `edit` vem de commonText (via containerFormMessages), reexposto no tipo.
import type { ContainerFormText } from '@/features/containers/islands/ContainerForm.island';
import { containerFormMessages } from '@/features/containers/islands/ContainerForm.messages';
import { commonText, type CommonText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import { m } from '@/paraglide/messages';

export type ContainerEditText = CommonText &
  ContainerFormText & { title: string; subtitle: string };

export const containerEditMessages = (locale: Locale): ContainerEditText => ({
  ...commonText(locale),
  ...containerFormMessages(locale),
  title: m.containers_title({}, { locale }),
  subtitle: m.containers_subtitle({}, { locale }),
});
