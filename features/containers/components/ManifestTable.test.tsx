import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { ManifestTable } from './ManifestTable';
import { TelemetryLog } from './TelemetryLog';

import { containerDetailMessages } from '@/pages/painel/conteineres/@id/messages';

const t = containerDetailMessages('pt-BR');

describe('ManifestTable', () => {
  it('lista itens do manifesto', () => {
    const { getByText } = render(() => (
      <ManifestTable
        items={[{ product_id: 'p1', product_name: 'Farelo de soja', quantity: 100, weight: 58 }]}
        t={t}
      />
    ));
    expect(getByText('Farelo de soja')).toBeInTheDocument();
  });

  it('mostra estado vazio', () => {
    const { getByText } = render(() => <ManifestTable items={[]} t={t} />);
    expect(getByText(t.emptyManifest)).toBeInTheDocument();
  });
});

describe('TelemetryLog', () => {
  it('mostra eventos com data e rótulo', () => {
    const { getByText, getByRole } = render(() => (
      <TelemetryLog
        logs={[
          { id: 'l1', event: 'Seal', description: 'Lacrado', timestamp: '2026-07-10T09:15:00Z' },
        ]}
        t={t}
      />
    ));
    expect(getByText('Lacrado')).toBeInTheDocument();
    expect(getByText('Lacre')).toBeInTheDocument();
    expect(getByRole('listitem')).toBeInTheDocument();
  });
});
