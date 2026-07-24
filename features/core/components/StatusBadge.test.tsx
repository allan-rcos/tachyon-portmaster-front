import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { RiskBadge } from './RiskBadge';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge / RiskBadge', () => {
  it('mostra o rótulo pt-BR do status', () => {
    const { getByText } = render(() => <StatusBadge status="InTransit" />);
    expect(getByText('Em trânsito')).toBeInTheDocument();
  });

  it('mostra a classe de risco por extenso', () => {
    const { getByText } = render(() => <RiskBadge riskClass="Class3FlammableLiquids" />);
    expect(getByText(/Líquidos inflamáveis/)).toBeInTheDocument();
  });
});
