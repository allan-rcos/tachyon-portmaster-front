import { render, waitFor } from '@solidjs/testing-library';
import { setInput, stubLocation } from '@testing/dom';
import userEvent from '@testing-library/user-event';
import { containerDetailMessages } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { loadManifestItem } from '@viewmodel/containers/mutations/load-manifest-item.mutation';
import { unloadManifestItem } from '@viewmodel/containers/mutations/unload-manifest-item.mutation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ManifestEditor } from './ManifestEditor.island';

vi.mock('@viewmodel/containers/mutations/load-manifest-item.mutation');
vi.mock('@viewmodel/containers/mutations/unload-manifest-item.mutation');

const mockedLoad = vi.mocked(loadManifestItem);
const mockedUnload = vi.mocked(unloadManifestItem);

const t = containerDetailMessages('pt-BR');
const products = [
  { id: 'prd_soja', name: 'Farelo de soja' },
  { id: 'prd_cafe', name: 'Café verde em grãos' },
];

let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  mockedLoad.mockResolvedValue({ container_id: 'ctr_1', items: [] } as never);
  mockedUnload.mockResolvedValue({ container_id: 'ctr_1', items: [] } as never);
});
afterEach(() => loc.restore());

describe('ManifestEditor island', () => {
  it('carrega o item no contêiner e recarrega a tela', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <ManifestEditor containerId="ctr_1" products={products} t={t} />
    ));

    setInput(getByLabelText(t.quantity), '500');
    await user.click(getByRole('button', { name: t.load }));

    await waitFor(() =>
      expect(mockedLoad).toHaveBeenCalledWith('ctr_1', { product_id: 'prd_soja', quantity: 500 }),
    );
    await waitFor(() => expect(loc.reloads()).toBeGreaterThan(0));
  });

  it('o mesmo formulário descarrega quando a ação escolhida é descarregar', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <ManifestEditor containerId="ctr_1" products={products} t={t} />
    ));

    setInput(getByLabelText(t.quantity), '20');
    await user.click(getByRole('button', { name: t.unload }));

    await waitFor(() =>
      expect(mockedUnload).toHaveBeenCalledWith('ctr_1', { product_id: 'prd_soja', quantity: 20 }),
    );
    expect(mockedLoad).not.toHaveBeenCalled();
  });

  it('valida a quantidade antes de chamar o ViewModel', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(() => (
      <ManifestEditor containerId="ctr_1" products={products} t={t} />
    ));

    await user.click(getByRole('button', { name: t.load }));

    await waitFor(() => expect(getByRole('alert')).toBeVisible());
    expect(mockedLoad).not.toHaveBeenCalled();
  });
});
