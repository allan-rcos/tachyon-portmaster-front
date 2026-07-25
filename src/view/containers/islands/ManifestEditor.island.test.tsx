import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { containerDetailMessages } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ManifestEditor } from './ManifestEditor.island';

import { setInput, stubLocation } from '@/test/utils';

const t = containerDetailMessages('pt-BR');
const products = [
  { id: 'prd_soja', name: 'Farelo de soja' },
  { id: 'prd_cafe', name: 'Café verde em grãos' },
];
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('ManifestEditor island', () => {
  it('carrega item e recarrega a página', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <ManifestEditor containerId="ctr_gesu0517" products={products} t={t} />
    ));
    setInput(getByLabelText(t.quantity), '500');
    await user.click(getByRole('button', { name: t.load }));
    await waitFor(() => expect(loc.reloads()).toBeGreaterThan(0));
  });

  it('valida quantidade antes de enviar', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(() => (
      <ManifestEditor containerId="ctr_gesu0517" products={products} t={t} />
    ));
    await user.click(getByRole('button', { name: t.load }));
    await waitFor(() => expect(getByRole('alert')).toBeVisible());
    expect(loc.reloads()).toBe(0);
  });
});
