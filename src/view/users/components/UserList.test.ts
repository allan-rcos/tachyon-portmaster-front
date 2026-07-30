// ============================================================
//  O componente recebe o ViewModel e só desenha. Como não formata nada, o teste
//  monta um VM de mentira com linhas já prontas — que é o que o `+data` entrega
//  em produção.
// ============================================================
import { fireEvent, getByRole, getByText, queryByRole } from '@testing-library/dom';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { usersListMessages } from '@viewmodel/users/i18n/user-list-page.messages';
import type { UserListVM, UserRowData } from '@viewmodel/users/user-list-page.vm';
import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';

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
  return {
    t: usersListMessages('pt-BR'),
    boundary: asyncBoundaryMessages('pt-BR'),
    items: () => rows,
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

function mount(vm: UserListVM): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(UserList({ vm }), el);
  return el;
}

describe('UserList', () => {
  it('lista usuários com perfis e link de edição', () => {
    const el = mount(vmWith());

    expect(getByRole(el, 'link', { name: 'Ana Marés' })).toHaveAttribute(
      'href',
      '/painel/usuarios/usr_1/editar',
    );
    expect(getByText(el, 'Administrador')).toBeInTheDocument();
  });

  it('esconde a ação de criar quando falta permissão', () => {
    const el = mount(vmWith({ canCreate: false }));
    expect(queryByRole(el, 'link', { name: /novo/i })).not.toBeInTheDocument();
  });

  it('chama o handler do ViewModel ao paginar', () => {
    const loadMore = vi.fn(async () => {});
    const vm = vmWith({ hasMore: () => true, loadMore });
    const el = mount(vm);

    fireEvent.click(getByRole(el, 'button', { name: vm.t.loadMore }));

    expect(loadMore).toHaveBeenCalledOnce();
  });
});
