/**
 * Composição de `/painel/usuarios` — Listagem de usuários.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { UserListScreen } from '@view/users/screens/UserListScreen';
import { createUserListVM, type UserListPageInput } from '@viewmodel/users/user-list-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createUserListVM(pageContext.data as UserListPageInput);
  return () => UserListScreen({ vm });
}
