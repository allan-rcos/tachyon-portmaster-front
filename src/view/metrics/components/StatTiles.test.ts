import { getAllByRole, getByText } from '@testing-library/dom';
import type { StatTileData } from '@viewmodel/metrics/dashboard-page.vm';
import { render } from 'lit';
import { describe, expect, it } from 'vitest';

import { StatTiles } from './StatTiles';

const tiles: StatTileData[] = [
  { key: 'active', label: 'Contêineres ativos', value: '12', icon: 'container', tone: 'gold' },
  { key: 'load', label: 'Carga do pátio', value: '58,3%', icon: 'weight', tone: 'orange' },
];

describe('StatTiles', () => {
  it('desenha um cartão por KPI, com o valor já formatado', () => {
    const el = document.createElement('div');
    document.body.append(el);
    render(StatTiles({ tiles }), el);

    expect(getAllByRole(el, 'listitem')).toHaveLength(2);
    expect(getByText(el, '58,3%')).toBeInTheDocument();
    expect(getByText(el, 'Contêineres ativos')).toBeInTheDocument();
  });
});
