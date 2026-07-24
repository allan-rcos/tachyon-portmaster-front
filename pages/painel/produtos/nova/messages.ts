// Catálogo da rota /painel/produtos/nova: texto do form (dono: ProductForm) +
// o "chrome" da página (título/subtítulo/rótulo do botão novo).
import type { Locale } from '@/features/core/i18n/locale';
import type { ProductFormText } from '@/features/products/islands/ProductForm.island';
import { productFormMessages } from '@/features/products/islands/ProductForm.messages';
import { m } from '@/paraglide/messages';

export type ProductNewText = ProductFormText & { title: string; subtitle: string; new: string };

export const productNewMessages = (locale: Locale): ProductNewText => ({
  ...productFormMessages(locale),
  title: m.products_title({}, { locale }),
  subtitle: m.products_subtitle({}, { locale }),
  new: m.products_new({}, { locale }),
});
