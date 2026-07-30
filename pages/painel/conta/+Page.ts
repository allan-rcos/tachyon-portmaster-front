import { AccountScreen } from '@view/account/screens/AccountScreen';
import { createAccountPageVM, type AccountPageInput } from '@viewmodel/account/account-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createAccountPageVM(pageContext.data as AccountPageInput);
  return () => AccountScreen({ vm });
}
