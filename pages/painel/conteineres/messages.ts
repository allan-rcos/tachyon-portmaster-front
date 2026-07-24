// Catálogo i18n da rota /painel/conteineres (lista). Dono do texto é a
// página; os componentes recebem `t` resolvido por prop. Termos de UI
// transversais vêm de `commonText` (composição evita duplicar literais).
// O tipo de retorno `ContainerListText` é o CONTRATO/schema das chaves que
// esta rota consome — `tsc` acusa se alguma faltar no `messages/*.json`.
import type { ContainerListText } from '@/features/containers/components/ContainerList';
import { commonText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import { m } from '@/paraglide/messages';

export const containersListMessages = (locale: Locale): ContainerListText => ({
  ...commonText(locale),
  title: m.containers_title({}, { locale }),
  subtitle: m.containers_subtitle({}, { locale }),
  new: m.containers_new({}, { locale }),
  code: m.containers_code({}, { locale }),
  status: m.containers_status({}, { locale }),
  weight: m.containers_weight({}, { locale }),
  capacity: m.containers_capacity({}, { locale }),
  occupancy: m.containers_occupancy({}, { locale }),
});
