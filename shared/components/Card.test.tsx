import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
  it('renderiza título e conteúdo com estrutura semântica', () => {
    const { getByRole, getByText } = render(() => (
      <Card title="Ocupação">
        <p>corpo</p>
      </Card>
    ));
    expect(getByRole('heading', { name: 'Ocupação' })).toBeInTheDocument();
    expect(getByText('corpo')).toBeInTheDocument();
  });
});
