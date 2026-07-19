import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { ProductList } from './ProductList';

import type { Product } from '@/services/gen/flow/v1/product';
import ptBR from '@/shared/i18n/messages/pt-BR';

const t = { ...ptBR.common, ...ptBR.products };
const items: Product[] = [
  { id: 'prd_1', name: 'Farelo de soja', density: 0.58, risk_class: 'None' },
  { id: 'prd_2', name: 'Óleo diesel', density: 0.84, risk_class: 'Class3FlammableLiquids' },
];

describe('ProductList', () => {
  it('lista produtos com classe de risco e link de edição', () => {
    const { getByRole, getByText } = render(() => <ProductList items={items} total={2} t={t} />);
    expect(getByRole('link', { name: 'Farelo de soja' })).toHaveAttribute(
      'href',
      '/painel/produtos/prd_1/editar',
    );
    expect(getByText(/Líquidos inflamáveis/)).toBeInTheDocument();
  });

  it('estado vazio', () => {
    const { getByText } = render(() => <ProductList items={[]} total={0} t={t} />);
    expect(getByText(t.empty)).toBeInTheDocument();
  });
});
