// Catálogo da rota /painel/produtos/@id/editar: texto do form (dono: ProductForm)
// + chrome da página. `edit` vem de commonText (via productFormMessages).
import type { Locale } from '@/features/core/i18n/locale';
import type { ProductFormText } from '@/features/products/islands/ProductForm.island';
import { productFormMessages } from '@/features/products/islands/ProductForm.messages';
import { m } from '@/paraglide/messages';

export type ProductEditText = ProductFormText & { edit: string; title: string; subtitle: string };

export const productEditMessages = (locale: Locale): ProductEditText => ({
  ...productFormMessages(locale),
  edit: m.common_edit({}, { locale }),
  title: m.products_title({}, { locale }),
  subtitle: m.products_subtitle({}, { locale }),
});
