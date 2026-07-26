// ============================================================
//  Manifesto e telemetria recebem linhas JÁ FORMATADAS pelo ViewModel — o que
//  este teste monta é exatamente a forma que o `+data` entrega em produção.
// ============================================================
import { render } from '@solidjs/testing-library';
import { containerDetailMessages } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { describe, it, expect } from 'vitest';

import { ManifestTable } from './ManifestTable';
import { TelemetryLog } from './TelemetryLog';

const t = containerDetailMessages('pt-BR');

describe('ManifestTable', () => {
  it('lista itens do manifesto com quantidade e peso prontos', () => {
    const { getByText } = render(() => (
      <ManifestTable
        items={[
          { productId: 'p1', productName: 'Farelo de soja', quantity: '100', weight: '58 kg' },
        ]}
        t={t}
      />
    ));
    expect(getByText('Farelo de soja')).toBeInTheDocument();
    expect(getByText('58 kg')).toBeInTheDocument();
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
          {
            id: 'l1',
            event: { label: 'Lacre', tone: 'sage' },
            description: 'Lacrado',
            timestamp: '2026-07-10T09:15:00Z',
            formattedTimestamp: '10/07/2026 09:15',
          },
        ]}
        t={t}
      />
    ));
    expect(getByText('Lacrado')).toBeInTheDocument();
    expect(getByText('Lacre')).toBeInTheDocument();
    expect(getByRole('listitem')).toBeInTheDocument();
  });
});
