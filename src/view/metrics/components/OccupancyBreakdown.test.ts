// ============================================================
//  Uma LINHA por status (era uma barra empilhada única). O componente recebe as
//  linhas já formatadas — contagem em string e fração já calculada.
// ============================================================
import { getAllByRole, getByRole, getByText } from '@testing-library/dom';
import type { OccupancyRowData } from '@viewmodel/metrics/dashboard-page.vm';
import { render } from 'lit';
import { describe, expect, it } from 'vitest';

import { OccupancyBreakdown } from './OccupancyBreakdown';

const rows: OccupancyRowData[] = [
  { key: 'loading', label: 'Carregando', count: '4', share: 40, tone: 'gold' },
  { key: 'sealed', label: 'Lacrados', count: '3', share: 30, tone: 'sage' },
  { key: 'in_transit', label: 'Em trânsito', count: '2', share: 20, tone: 'teal' },
  { key: 'empty', label: 'Vazios', count: '1', share: 10, tone: 'neutral' },
];

function mount(): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(OccupancyBreakdown({ rows, label: 'Ocupação do pátio' }), el);
  return el;
}

describe('OccupancyBreakdown', () => {
  it('desenha uma linha por status, com rótulo e contagem', () => {
    const el = mount();

    expect(getAllByRole(el, 'listitem')).toHaveLength(4);
    expect(getByText(el, 'Carregando')).toBeInTheDocument();
    expect(getByText(el, '4')).toBeInTheDocument();
  });

  it('rotula o conjunto para leitores de tela', () => {
    const el = mount();
    expect(getByRole(el, 'list', { name: 'Ocupação do pátio' })).toBeInTheDocument();
  });
});
