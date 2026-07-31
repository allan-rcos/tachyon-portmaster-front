/**
 * Texto do formulário de produto (dono: o próprio form). As rotas
 * /produtos/nova e /produtos/@id/editar resolvem este catálogo no seu +data
 * e passam por prop. Termos transversais e de validação vêm de commonText/valText.
 *
 * @packageDocumentation
 */
import { commonText, valText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { ProductFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const productFormMessages = (locale: Locale): ProductFormText => ({
  ...commonText(locale),
  ...valText(locale),
  data: m.products_data({}, { locale }),
  name: m.products_name({}, { locale }),
  density: m.products_density({}, { locale }),
  riskClass: m.products_risk_class({}, { locale }),
  deleteConfirm: m.products_delete_confirm({}, { locale }),
});
