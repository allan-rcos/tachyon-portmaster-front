import { render } from '@solidjs/testing-library';
import type { Metrics } from 'tachyon-portmaster-sdk/metrics';
import { describe, it, expect } from 'vitest';

import { StatTiles } from './StatTiles';

import { painelMessages } from '@/pages/painel/messages';

const t = painelMessages('pt-BR');
const metrics: Metrics = {
  active_containers: 6,
  total_containers: 8,
  yard_load: 42.5,
  registered_products: 6,
  occupancy_division: { empty: 2, loading: 3, sealed: 2, in_transit: 1 },
};

describe('StatTiles', () => {
  it('mostra os KPIs formatados', () => {
    const { getByText, getAllByText } = render(() => <StatTiles metrics={metrics} t={t} />);
    expect(getByText('8')).toBeInTheDocument();
    expect(getByText('42,5%')).toBeInTheDocument();
    expect(getAllByText('6')).toHaveLength(2);
    expect(getByText(t.activeContainers)).toBeInTheDocument();
  });
});
