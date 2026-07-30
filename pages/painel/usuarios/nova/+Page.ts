import { UserCreateScreen } from '@view/users/screens/UserCreateScreen';
import { createUserCreateVM, type UserCreatePageInput } from '@viewmodel/users/user-create-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createUserCreateVM(pageContext.data as UserCreatePageInput);
  return () => UserCreateScreen({ vm });
}
