// ============================================================
//  O componente recebe o ViewModel e só desenha — as contagens já chegam
//  formatadas, que é o que o `+data` entrega em produção.
// ============================================================
import { fireEvent, getByRole, getByText, queryByRole } from '@testing-library/dom';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { rolesListMessages } from '@viewmodel/roles/i18n/role-list-page.messages';
import type { RoleListVM, RoleRowData } from '@viewmodel/roles/role-list-page.vm';
import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';

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
  return {
    t: rolesListMessages('pt-BR'),
    boundary: asyncBoundaryMessages('pt-BR'),
    items: () => rows,
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

function mount(vm: RoleListVM): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(RoleList({ vm }), el);
  return el;
}

describe('RoleList', () => {
  it('lista perfis com link para permissões', () => {
    const vm = vmWith();
    const el = mount(vm);
    // O nome do perfil é o título do cartão; quem leva às permissões é a ação.
    expect(getByRole(el, 'heading', { name: 'Administrador' })).toBeInTheDocument();
    expect(getByRole(el, 'link', { name: `${vm.t.edit} Administrador` })).toHaveAttribute(
      'href',
      '/painel/perfis/rol_1/permissoes',
    );
  });

  it('mostra as permissões concedidas como chips', () => {
    const el = mount(vmWith());
    expect(getByText(el, 'Ver produtos')).toBeInTheDocument();
    expect(getByText(el, 'Criar produtos')).toBeInTheDocument();
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
