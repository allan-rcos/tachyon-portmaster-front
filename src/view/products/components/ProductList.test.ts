// ============================================================
//  O componente recebe o ViewModel e só desenha. Como ele não formata nada, o
//  teste monta um VM de mentira com linhas já prontas — que é exatamente o que
//  o `+data` entrega em produção.
// ============================================================
import { fireEvent, getByRole, getByText, queryByRole } from '@testing-library/dom';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { productsListMessages } from '@viewmodel/products/i18n/product-list-page.messages';
import type { ProductListVM, ProductRowData } from '@viewmodel/products/product-list-page.vm';
import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import { ProductList } from './ProductList';

const rows: ProductRowData[] = [
  {
    id: 'prd_1',
    name: 'Farelo de soja',
    density: '0,58 t/m³',
    risk: { label: 'Sem risco', tone: 'sage' },
    editHref: '/painel/produtos/prd_1/editar',
  },
  {
    id: 'prd_2',
    name: 'Óleo diesel',
    density: '0,84 t/m³',
    risk: { label: 'Classe 3 — Líquidos inflamáveis', tone: 'orange' },
    editHref: '/painel/produtos/prd_2/editar',
  },
];

/** VM de mentira: só os campos que o componente lê. */
function vmWith(overrides: Partial<ProductListVM> = {}): ProductListVM {
  return {
    t: productsListMessages('pt-BR'),
    boundary: asyncBoundaryMessages('pt-BR'),
    items: () => rows,
    canCreate: true,
    newHref: '/painel/produtos/nova',
    hasMore: () => false,
    isLoadingMore: () => false,
    errorMessage: () => undefined,
    loadMore: async () => {},
    retry: async () => {},
    ...overrides,
  };
}

function mount(vm: ProductListVM): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(ProductList({ vm }), el);
  return el;
}

describe('ProductList', () => {
  it('lista produtos com densidade formatada, risco e link de edição', () => {
    const el = mount(vmWith());

    expect(getByRole(el, 'link', { name: 'Farelo de soja' })).toHaveAttribute(
      'href',
      '/painel/produtos/prd_1/editar',
    );
    expect(getByText(el, '0,58 t/m³')).toBeInTheDocument();
    expect(getByText(el, /Líquidos inflamáveis/)).toBeInTheDocument();
  });

  it('estado vazio', () => {
    const vm = vmWith({ items: () => [] });
    const el = mount(vm);

    expect(getByText(el, vm.t.empty)).toBeInTheDocument();
  });

  it('esconde a ação de criar quando falta permissão', () => {
    const el = mount(vmWith({ canCreate: false }));
    expect(queryByRole(el, 'link', { name: /novo/i })).not.toBeInTheDocument();
  });

  it('chama o handler do ViewModel ao paginar — sem lambda na fronteira', () => {
    const loadMore = vi.fn(async () => {});
    const vm = vmWith({ hasMore: () => true, loadMore });
    const el = mount(vm);

    fireEvent.click(getByRole(el, 'button', { name: vm.t.loadMore }));

    expect(loadMore).toHaveBeenCalledOnce();
  });

  it('mostra o erro de paginação e oferece nova tentativa', () => {
    const retry = vi.fn(async () => {});
    const vm = vmWith({ errorMessage: () => 'Falhou', retry });
    const el = mount(vm);

    expect(getByText(el, 'Falhou')).toBeInTheDocument();
    fireEvent.click(getByRole(el, 'button', { name: vm.boundary.retry }));

    expect(retry).toHaveBeenCalledOnce();
  });
});
