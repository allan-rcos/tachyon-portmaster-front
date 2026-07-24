// Catálogo da rota /painel/conteineres/nova: texto do form + chrome da página.
import type { ContainerFormText } from '@/features/containers/islands/ContainerForm.island';
import { containerFormMessages } from '@/features/containers/islands/ContainerForm.messages';
import type { Locale } from '@/features/core/i18n/locale';
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
