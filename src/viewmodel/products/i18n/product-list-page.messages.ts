// Catálogo i18n da rota /painel/produtos (lista). Dono do texto é a página;
// o componente recebe `t` resolvido por prop. `ProductListText` é o contrato.
import { commonText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { ProductListText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const productsListMessages = (locale: Locale): ProductListText => ({
  ...commonText(locale),
  title: m.products_title({}, { locale }),
  subtitle: m.products_subtitle({}, { locale }),
  new: m.products_new({}, { locale }),
  name: m.products_name({}, { locale }),
  density: m.products_density({}, { locale }),
  riskClass: m.products_risk_class({}, { locale }),
});
