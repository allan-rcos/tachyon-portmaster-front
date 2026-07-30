// ============================================================
//  O componente recebe o ViewModel e só desenha. O teste do link de "próxima
//  página" saiu junto com a paginação por href: agora a paginação é por cursor
//  e incremental, então o que se verifica é a CHAMADA do handler.
// ============================================================
import { fireEvent, getByRole, getByText } from '@testing-library/dom';
import type {
  ContainerListVM,
  ContainerRowData,
} from '@viewmodel/containers/container-list-page.vm';
import { containersListMessages } from '@viewmodel/containers/i18n/container-list-page.messages';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import { ContainerList } from './ContainerList';

const rows: ContainerRowData[] = [
  {
    id: 'ctr_1',
    code: 'MSKU-4410',
    status: { label: 'Carregando', tone: 'gold' },
    weight: '12.000 kg',
    capacity: '28.000 kg',
    occupancyValue: 42.9,
    occupancy: '42,9%',
    detailHref: '/painel/conteineres/ctr_1',
    editHref: '/painel/conteineres/ctr_1/editar',
  },
];

/** VM de mentira: só os campos que o componente lê. */
function vmWith(overrides: Partial<ContainerListVM> = {}): ContainerListVM {
  const t = containersListMessages('pt-BR');
  return {
    t,
    boundary: asyncBoundaryMessages('pt-BR'),
    items: () => rows,
    filters: { search: '', status: '' },
    statusOptions: [
      { value: '', label: t.allStatuses, selected: true, href: '/painel/conteineres' },
    ],
    canCreate: true,
    newHref: '/painel/conteineres/nova',
    hasMore: () => false,
    isLoadingMore: () => false,
    errorMessage: () => undefined,
    loadMore: async () => {},
    retry: async () => {},
    ...overrides,
  } as ContainerListVM;
}

function mount(vm: ContainerListVM): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(ContainerList({ vm }), el);
  return el;
}

describe('ContainerList', () => {
  it('renderiza um cartão-link por contêiner e a ação de novo', () => {
    const vm = vmWith();
    const el = mount(vm);

    // O cartão INTEIRO é o link para o resumo, então o nome acessível é o
    // conteúdo do cartão — daí casar por trecho em vez de igualdade.
    expect(getByRole(el, 'link', { name: /MSKU-4410/ })).toHaveAttribute(
      'href',
      '/painel/conteineres/ctr_1',
    );
    expect(getByRole(el, 'link', { name: new RegExp(vm.t.new) })).toHaveAttribute(
      'href',
      '/painel/conteineres/nova',
    );
  });

  it('mostra ocupação e pesos já formatados pelo ViewModel', () => {
    const el = mount(vmWith());
    expect(getByText(el, '42,9%')).toBeInTheDocument();
    expect(getByText(el, /12\.000 kg \/ 28\.000 kg/)).toBeInTheDocument();
    expect(getByText(el, /cap\. 28\.000 kg/)).toBeInTheDocument();
  });

  it('oferece o filtro de status como links que preservam a busca', () => {
    const vm = vmWith();
    const el = mount(vm);
    const tab = getByRole(el, 'link', { name: vm.t.allStatuses });
    expect(tab).toHaveAttribute('href', '/painel/conteineres');
    expect(tab).toHaveAttribute('aria-current', 'page');
  });

  it('mostra estado vazio quando não há itens', () => {
    const vm = vmWith({ items: () => [] });
    const el = mount(vm);
    expect(getByText(el, vm.t.empty)).toBeInTheDocument();
  });

  it('chama o handler do ViewModel ao paginar', () => {
    const loadMore = vi.fn(async () => {});
    const vm = vmWith({ hasMore: () => true, loadMore });
    const el = mount(vm);

    fireEvent.click(getByRole(el, 'button', { name: vm.t.loadMore }));

    expect(loadMore).toHaveBeenCalledOnce();
  });
});
