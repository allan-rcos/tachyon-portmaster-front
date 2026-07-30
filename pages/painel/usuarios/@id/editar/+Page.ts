/**
 * Composição de `/painel/usuarios/@id/editar` — Edição de usuário.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { UserEditScreen } from '@view/users/screens/UserEditScreen';
import { createUserEditVM, type UserEditPageInput } from '@viewmodel/users/user-edit-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createUserEditVM(pageContext.data as UserEditPageInput);
  return () => UserEditScreen({ vm });
}
