import { RouteModal } from '@view/core/islands/RouteModal.island';
import { RoleList } from '@view/roles/components/RoleList';
import { RoleForm } from '@view/roles/islands/RoleForm.island';
import type { RoleCreateVM } from '@viewmodel/roles/role-create-page.vm';
import type { RoleListVM } from '@viewmodel/roles/role-list-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela de criação de perfil. */
export interface RoleCreateScreenProps {
  /** ViewModel do formulário. */
  vm: RoleCreateVM;
  /** ViewModel da listagem que fica atrás do modal. */
  list: RoleListVM;
}

/**
 * Criação de perfil, com a matriz de permissões — modal sobre a listagem.
 *
 * É o modal mais alto dos cinco: a matriz de permissões é longa. Por isso o
 * `RouteModal` rola só o CORPO, mantendo título e "fechar" sempre visíveis.
 *
 * @param props.vm   ViewModel do formulário.
 * @param props.list ViewModel da listagem de fundo.
 */
export function RoleCreateScreen(props: RoleCreateScreenProps): JSX.Element {
  return (
    <>
      <RoleList vm={props.list} />
      <RouteModal
        eyebrow={props.list.t.eyebrow}
        title={props.vm.t.new}
        icon="shield"
        tint="gold"
        closeHref={props.vm.listHref}
        closeLabel={props.vm.t.close}
      >
        <RoleForm vm={props.vm} />
      </RouteModal>
    </>
  );
}
