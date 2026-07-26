import { render } from '@solidjs/testing-library';
import type { StatTileData } from '@viewmodel/metrics/dashboard-page.vm';
import { describe, it, expect } from 'vitest';

import { StatTiles } from './StatTiles';

const tiles: StatTileData[] = [
  { key: 'active', label: 'Contêineres ativos', value: '12', icon: 'container', tone: 'gold' },
  { key: 'load', label: 'Carga do pátio', value: '58,3%', icon: 'weight', tone: 'orange' },
];

describe('StatTiles', () => {
  it('desenha um cartão por KPI, com o valor já formatado', () => {
    const { getAllByRole, getByText } = render(() => <StatTiles tiles={tiles} />);

    expect(getAllByRole('listitem')).toHaveLength(2);
    expect(getByText('58,3%')).toBeInTheDocument();
    expect(getByText('Contêineres ativos')).toBeInTheDocument();
  });
});
