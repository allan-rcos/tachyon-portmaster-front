/**
 * Catálogo da rota /painel/conteineres/nova: texto do form + chrome da página.
 *
 * @packageDocumentation
 */
import { containerFormMessages } from '@viewmodel/containers/i18n/container-form.messages';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { ContainerFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export type ContainerNewText = ContainerFormText & {
  title: string;
  subtitle: string;
  new: string;
};

export const containerNewMessages = (locale: Locale): ContainerNewText => ({
  ...containerFormMessages(locale),
  title: m.containers_title({}, { locale }),
  subtitle: m.containers_subtitle({}, { locale }),
  new: m.containers_new({}, { locale }),
});
