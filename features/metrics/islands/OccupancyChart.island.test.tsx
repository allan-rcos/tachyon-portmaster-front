import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { OccupancyChart } from './OccupancyChart.island';

import ptBR from '@/shared/i18n/messages/pt-BR';

const t = { ...ptBR.common, ...ptBR.painel };
const division = { empty: 2, loading: 3, sealed: 2, in_transit: 1 };

describe('OccupancyChart island', () => {
  it('renderiza a legenda sem quebrar (canvas ausente no jsdom)', () => {
    const { getByText } = render(() => <OccupancyChart division={division} t={t} />);
    expect(getByText(t.statusLoading)).toBeInTheDocument();
    expect(getByText(t.statusInTransit)).toBeInTheDocument();
  });
});
