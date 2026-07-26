// ============================================================
//  O componente recebe o ViewModel e só desenha. Como não formata nada, o teste
//  monta um VM de mentira com linhas já prontas — que é o que o `+data` entrega
//  em produção.
// ============================================================
import { fireEvent, render } from '@solidjs/testing-library';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { usersListMessages } from '@viewmodel/users/i18n/user-list-page.messages';
import type { UserListVM, UserRowData } from '@viewmodel/users/user-list-page.vm';
import { describe, it, expect, vi } from 'vitest';

import { UserList } from './UserList';

const rows: UserRowData[] = [
  {
    id: 'usr_1',
    name: 'Ana Marés',
    email: 'ana@x.com',
    roles: ['Administrador'],
    editHref: '/painel/usuarios/usr_1/editar',
  },
];

/** VM de mentira: só os campos que o componente lê. */
function vmWith(overrides: Partial<UserListVM> = {}): UserListVM {
  const items = Object.assign(() => rows, { set: () => {} });
  return {
    t: usersListMessages('pt-BR'),
    boundary: asyncBoundaryMessages('pt-BR'),
    items,
    canCreate: true,
    newHref: '/painel/usuarios/nova',
    hasMore: () => false,
    isLoadingMore: () => false,
    errorMessage: () => undefined,
    loadMore: async () => {},
    retry: async () => {},
    ...overrides,
  } as UserListVM;
}

describe('UserList', () => {
  it('lista usuários com perfis e link de edição', () => {
    const { getByRole, getByText } = render(() => <UserList vm={vmWith()} />);

    expect(getByRole('link', { name: 'Ana Marés' })).toHaveAttribute(
      'href',
      '/painel/usuarios/usr_1/editar',
    );
    expect(getByText('Administrador')).toBeInTheDocument();
  });

  it('esconde a ação de criar quando falta permissão', () => {
    const { queryByRole } = render(() => <UserList vm={vmWith({ canCreate: false })} />);
    expect(queryByRole('link', { name: /novo/i })).not.toBeInTheDocument();
  });

  it('chama o handler do ViewModel ao paginar', () => {
    const loadMore = vi.fn();
    const vm = vmWith({ hasMore: () => true, loadMore });
    const { getByRole } = render(() => <UserList vm={vm} />);

    fireEvent.click(getByRole('button', { name: vm.t.loadMore }));

    expect(loadMore).toHaveBeenCalledOnce();
  });
});
