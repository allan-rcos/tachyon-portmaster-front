/**
 * Catálogo da rota /painel/produtos/@id/editar: texto do form (dono: ProductForm)
 * + chrome da página. `edit` vem de commonText (via productFormMessages).
 *
 * @packageDocumentation
 */
import type { Locale } from '@viewmodel/core/i18n/locale';
import { productFormMessages } from '@viewmodel/products/i18n/product-form.messages';

import type { ProductFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export type ProductEditText = ProductFormText & { edit: string; title: string; subtitle: string };

export const productEditMessages = (locale: Locale): ProductEditText => ({
  ...productFormMessages(locale),
  edit: m.common_edit({}, { locale }),
  title: m.products_title({}, { locale }),
  subtitle: m.products_subtitle({}, { locale }),
});
