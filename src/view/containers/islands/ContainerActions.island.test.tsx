import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { containerDetailMessages } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { deleteContainer } from '@viewmodel/containers/mutations/delete-container.mutation';
import { dispatchContainer } from '@viewmodel/containers/mutations/dispatch-container.mutation';
import { sealContainer } from '@viewmodel/containers/mutations/seal-container.mutation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContainerActions } from './ContainerActions.island';

vi.mock('@viewmodel/containers/mutations/seal-container.mutation');
vi.mock('@viewmodel/containers/mutations/dispatch-container.mutation');
vi.mock('@viewmodel/containers/mutations/delete-container.mutation');

const mockedSeal = vi.mocked(sealContainer);
const mockedDispatch = vi.mocked(dispatchContainer);
const mockedDelete = vi.mocked(deleteContainer);

const t = containerDetailMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
  mockedSeal.mockResolvedValue(undefined);
  mockedDispatch.mockResolvedValue(undefined);
  mockedDelete.mockResolvedValue(undefined);
});
afterEach(() => loc.restore());

describe('ContainerActions island', () => {
  it('oferece lacrar e excluir quando só lacrar é permitido', () => {
    const { getByRole, queryByRole } = render(() => (
      <ContainerActions containerId="ctr_1" canSeal canDispatch={false} t={t} />
    ));
    expect(getByRole('button', { name: t.seal })).toBeInTheDocument();
    expect(getByRole('button', { name: t.delete })).toBeInTheDocument();
    expect(queryByRole('button', { name: t.dispatch })).toBeNull();
  });

  it('oferece despachar quando despachar é permitido', () => {
    const { getByRole } = render(() => (
      <ContainerActions containerId="ctr_1" canSeal={false} canDispatch t={t} />
    ));
    expect(getByRole('button', { name: t.dispatch })).toBeInTheDocument();
  });

  it('só lacra após a confirmação, e então recarrega', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(() => (
      <ContainerActions containerId="ctr_1" canSeal canDispatch={false} t={t} />
    ));

    await user.click(getByRole('button', { name: t.seal }));
    expect(mockedSeal).not.toHaveBeenCalled();

    expect(getByRole('dialog')).toBeInTheDocument();
    await user.click(getAllByRole('button', { name: t.seal }).at(-1)!);

    await waitFor(() => expect(mockedSeal).toHaveBeenCalledWith('ctr_1'));
    await waitFor(() => expect(loc.reloads()).toBeGreaterThan(0));
  });

  it('exclui pelo id após confirmação', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(() => (
      <ContainerActions containerId="ctr_9" canSeal canDispatch={false} t={t} />
    ));

    await user.click(getByRole('button', { name: t.delete }));
    await user.click(getAllByRole('button', { name: t.delete }).at(-1)!);

    await waitFor(() => expect(mockedDelete).toHaveBeenCalledWith('ctr_9'));
  });
});
