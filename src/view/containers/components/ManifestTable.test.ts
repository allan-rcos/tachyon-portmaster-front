// ============================================================
//  Manifesto e telemetria recebem linhas JÁ FORMATADAS pelo ViewModel — o que
//  este teste monta é exatamente a forma que o `+data` entrega em produção.
// ============================================================
import { getByRole, getByText } from '@testing-library/dom';
import { containerDetailMessages } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { render } from 'lit';
import { describe, expect, it } from 'vitest';

import { ManifestTable } from './ManifestTable';
import { TelemetryLog } from './TelemetryLog';

const t = containerDetailMessages('pt-BR');

function mount(template: ReturnType<typeof ManifestTable>): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(template, el);
  return el;
}

describe('ManifestTable', () => {
  it('lista itens do manifesto com quantidade e peso prontos', () => {
    const el = mount(
      ManifestTable({
        items: [
          { productId: 'p1', productName: 'Farelo de soja', quantity: '100', weight: '58 kg' },
        ],
        t,
      }),
    );
    expect(getByText(el, 'Farelo de soja')).toBeInTheDocument();
    expect(getByText(el, '58 kg')).toBeInTheDocument();
  });

  it('mostra estado vazio', () => {
    const el = mount(ManifestTable({ items: [], t }));
    expect(getByText(el, t.emptyManifest)).toBeInTheDocument();
  });
});

describe('TelemetryLog', () => {
  it('mostra eventos com data e rótulo', () => {
    const el = mount(
      TelemetryLog({
        logs: [
          {
            id: 'l1',
            event: { label: 'Lacre', tone: 'sage' },
            description: 'Lacrado',
            timestamp: '2026-07-10T09:15:00Z',
            formattedTimestamp: '10/07/2026 09:15',
          },
        ],
        t,
      }),
    );
    expect(getByText(el, 'Lacrado')).toBeInTheDocument();
    expect(getByText(el, 'Lacre')).toBeInTheDocument();
    expect(getByRole(el, 'listitem')).toBeInTheDocument();
  });
});
