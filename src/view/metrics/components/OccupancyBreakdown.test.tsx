// ============================================================
//  Uma LINHA por status (era uma barra empilhada única). O componente recebe as
//  linhas já formatadas — contagem em string e fração já calculada.
// ============================================================
import { render } from '@solidjs/testing-library';
import type { OccupancyRowData } from '@viewmodel/metrics/dashboard-page.vm';
import { describe, it, expect } from 'vitest';

import { OccupancyBreakdown } from './OccupancyBreakdown';

const rows: OccupancyRowData[] = [
  { key: 'loading', label: 'Carregando', count: '4', share: 40, tone: 'gold' },
  { key: 'sealed', label: 'Lacrados', count: '3', share: 30, tone: 'sage' },
  { key: 'in_transit', label: 'Em trânsito', count: '2', share: 20, tone: 'teal' },
  { key: 'empty', label: 'Vazios', count: '1', share: 10, tone: 'neutral' },
];

describe('OccupancyBreakdown', () => {
  it('desenha uma linha por status, com rótulo e contagem', () => {
    const { getAllByRole, getByText } = render(() => (
      <OccupancyBreakdown rows={rows} label="Ocupação do pátio" />
    ));

    expect(getAllByRole('listitem')).toHaveLength(4);
    expect(getByText('Carregando')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
  });

  it('rotula o conjunto para leitores de tela', () => {
    const { getByRole } = render(() => (
      <OccupancyBreakdown rows={rows} label="Ocupação do pátio" />
    ));
    expect(getByRole('list', { name: 'Ocupação do pátio' })).toBeInTheDocument();
  });
});
