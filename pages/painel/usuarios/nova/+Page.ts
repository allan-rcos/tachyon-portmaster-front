/**
 * Composição de `/painel/usuarios/nova` — Criação de usuário.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
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
