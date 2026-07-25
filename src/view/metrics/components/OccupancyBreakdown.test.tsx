import { render } from '@solidjs/testing-library';
import { painelMessages } from '@viewmodel/metrics/i18n/dashboard-page.messages';
import { describe, it, expect } from 'vitest';

import { OccupancyBreakdown, segmentsOf } from './OccupancyBreakdown';


const t = painelMessages('pt-BR');
const division = { empty: 2, loading: 3, sealed: 2, in_transit: 1 };

describe('OccupancyBreakdown', () => {
  it('lista cada status com sua contagem', () => {
    const { getByRole } = render(() => <OccupancyBreakdown division={division} t={t} />);
    const dl = getByRole('img', { name: t.occupancy });
    expect(dl).toBeInTheDocument();
  });

  it('segmentsOf soma corretamente e ordena por relevância', () => {
    const segs = segmentsOf(division, t);
    expect(segs.map((s) => s.key)).toEqual(['loading', 'sealed', 'in_transit', 'empty']);
    expect(segs.reduce((s, x) => s + x.count, 0)).toBe(8);
  });
});
