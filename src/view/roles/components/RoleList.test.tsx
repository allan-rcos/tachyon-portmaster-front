// ============================================================
//  O componente recebe o ViewModel e só desenha — as contagens já chegam
//  formatadas, que é o que o `+data` entrega em produção.
// ============================================================
import { fireEvent, render } from '@solidjs/testing-library';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { rolesListMessages } from '@viewmodel/roles/i18n/role-list-page.messages';
import type { RoleListVM, RoleRowData } from '@viewmodel/roles/role-list-page.vm';
import { describe, it, expect, vi } from 'vitest';

import { RoleList } from './RoleList';

const rows: RoleRowData[] = [
  {
    id: 'rol_1',
    name: 'Administrador',
    userCount: '1',
    permissions: ['Ver produtos', 'Criar produtos'],
    permissionCount: '2',
    permissionsHref: '/painel/perfis/rol_1/permissoes',
  },
];

/** VM de mentira: só os campos que o componente lê. */
function vmWith(overrides: Partial<RoleListVM> = {}): RoleListVM {
  const items = Object.assign(() => rows, { set: () => {} });
  return {
    t: rolesListMessages('pt-BR'),
    boundary: asyncBoundaryMessages('pt-BR'),
    items,
    canCreate: true,
    newHref: '/painel/perfis/nova',
    hasMore: () => false,
    isLoadingMore: () => false,
    errorMessage: () => undefined,
    loadMore: async () => {},
    retry: async () => {},
    ...overrides,
  } as RoleListVM;
}

describe('RoleList', () => {
  it('lista perfis com link para permissões', () => {
    const vm = vmWith();
    const { getByRole } = render(() => <RoleList vm={vm} />);
    // O nome do perfil é o título do cartão; quem leva às permissões é a ação.
    expect(getByRole('heading', { name: 'Administrador' })).toBeInTheDocument();
    expect(getByRole('link', { name: `${vm.t.edit} Administrador` })).toHaveAttribute(
      'href',
      '/painel/perfis/rol_1/permissoes',
    );
  });

  it('mostra as permissões concedidas como chips', () => {
    const { getByText } = render(() => <RoleList vm={vmWith()} />);
    expect(getByText('Ver produtos')).toBeInTheDocument();
    expect(getByText('Criar produtos')).toBeInTheDocument();
  });

  it('esconde a ação de criar quando falta permissão', () => {
    const { queryByRole } = render(() => <RoleList vm={vmWith({ canCreate: false })} />);
    expect(queryByRole('link', { name: /novo/i })).not.toBeInTheDocument();
  });

  it('chama o handler do ViewModel ao paginar', () => {
    const loadMore = vi.fn();
    const vm = vmWith({ hasMore: () => true, loadMore });
    const { getByRole } = render(() => <RoleList vm={vm} />);

    fireEvent.click(getByRole('button', { name: vm.t.loadMore }));

    expect(loadMore).toHaveBeenCalledOnce();
  });
});
