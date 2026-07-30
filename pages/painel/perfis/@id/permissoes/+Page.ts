/**
 * Composição de `/painel/perfis/@id/permissoes` — A matriz de permissões do perfil. A gravação substitui o conjunto inteiro.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { RolePermissionsScreen } from '@view/roles/screens/RolePermissionsScreen';
import {
  createRolePermissionsVM,
  type RolePermissionsPageInput,
} from '@viewmodel/roles/role-permissions-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createRolePermissionsVM(pageContext.data as RolePermissionsPageInput);
  return () => RolePermissionsScreen({ vm });
}
