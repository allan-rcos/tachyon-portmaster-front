// ============================================================
//  O componente recebe o ViewModel e só desenha. Como ele não formata nada, o
//  teste monta um VM de mentira com linhas já prontas — que é exatamente o que
//  o `+data` entrega em produção.
// ============================================================
import { fireEvent, render } from '@solidjs/testing-library';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { productsListMessages } from '@viewmodel/products/i18n/product-list-page.messages';
import type { ProductListVM, ProductRowData } from '@viewmodel/products/product-list-page.vm';
import { describe, it, expect, vi } from 'vitest';

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
  const items = Object.assign(() => rows, { set: () => {} });
  return {
    t: productsListMessages('pt-BR'),
    boundary: asyncBoundaryMessages('pt-BR'),
    items,
    canCreate: true,
    newHref: '/painel/produtos/nova',
    hasMore: () => false,
    isLoadingMore: () => false,
    errorMessage: () => undefined,
    loadMore: async () => {},
    retry: async () => {},
    ...overrides,
  } as ProductListVM;
}

describe('ProductList', () => {
  it('lista produtos com densidade formatada, risco e link de edição', () => {
    const { getByRole, getByText } = render(() => <ProductList vm={vmWith()} />);

    expect(getByRole('link', { name: 'Farelo de soja' })).toHaveAttribute(
      'href',
      '/painel/produtos/prd_1/editar',
    );
    expect(getByText('0,58 t/m³')).toBeInTheDocument();
    expect(getByText(/Líquidos inflamáveis/)).toBeInTheDocument();
  });

  it('estado vazio', () => {
    const empty = Object.assign(() => [] as ProductRowData[], { set: () => {} });
    const vm = vmWith({ items: empty });
    const { getByText } = render(() => <ProductList vm={vm} />);

    expect(getByText(vm.t.empty)).toBeInTheDocument();
  });

  it('esconde a ação de criar quando falta permissão', () => {
    const { queryByRole } = render(() => <ProductList vm={vmWith({ canCreate: false })} />);
    expect(queryByRole('link', { name: /novo/i })).not.toBeInTheDocument();
  });

  it('chama o handler do ViewModel ao paginar — sem lambda na fronteira', () => {
    const loadMore = vi.fn();
    const vm = vmWith({ hasMore: () => true, loadMore });
    const { getByRole } = render(() => <ProductList vm={vm} />);

    fireEvent.click(getByRole('button', { name: vm.t.loadMore }));

    expect(loadMore).toHaveBeenCalledOnce();
  });

  it('mostra o erro de paginação e oferece nova tentativa', () => {
    const retry = vi.fn();
    const vm = vmWith({ errorMessage: () => 'Falhou', retry });
    const { getByRole, getByText } = render(() => <ProductList vm={vm} />);

    expect(getByText('Falhou')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: vm.boundary.retry }));

    expect(retry).toHaveBeenCalledOnce();
  });
});
