/**
 * Catálogo da rota /painel/produtos/nova: texto do form (dono: ProductForm) +
 * o "chrome" da página (título/subtítulo/rótulo do botão novo).
 *
 * @packageDocumentation
 */
import type { Locale } from '@viewmodel/core/i18n/locale';
import { productFormMessages } from '@viewmodel/products/i18n/product-form.messages';

import type { ProductFormText } from './text-contracts';

import { m } from '@/paraglide/messages';

export type ProductNewText = ProductFormText & { title: string; subtitle: string; new: string };

export const productNewMessages = (locale: Locale): ProductNewText => ({
  ...productFormMessages(locale),
  title: m.products_title({}, { locale }),
  subtitle: m.products_subtitle({}, { locale }),
  new: m.products_new({}, { locale }),
});
