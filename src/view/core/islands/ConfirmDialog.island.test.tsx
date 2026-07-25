import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ConfirmDialog } from './ConfirmDialog.island';

const base = {
  triggerLabel: 'Lacrar',
  title: 'Lacrar contêiner',
  message: 'Confirma?',
  confirmLabel: 'Lacrar',
  cancelLabel: 'Cancelar',
};

describe('ConfirmDialog', () => {
  it('abre, confirma e chama onConfirm + onDone', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onDone = vi.fn();
    const { getByRole, getAllByRole, queryByRole } = render(() => (
      <ConfirmDialog {...base} onConfirm={onConfirm} onDone={onDone} />
    ));

    await user.click(getByRole('button', { name: 'Lacrar' }));
    expect(getByRole('dialog')).toBeInTheDocument();

    await user.click(getAllByRole('button', { name: 'Lacrar' }).at(-1)!);
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
    expect(onDone).toHaveBeenCalledOnce();
    await waitFor(() => expect(queryByRole('dialog')).toBeNull());
  });

  it('mostra erro e mantém o diálogo aberto quando onConfirm falha', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockRejectedValue(new Error('x'));
    const { getByRole, getAllByRole } = render(() => (
      <ConfirmDialog {...base} onConfirm={onConfirm} />
    ));

    await user.click(getByRole('button', { name: 'Lacrar' }));
    const confirm = getAllByRole('button', { name: 'Lacrar' }).at(-1)!;
    await user.click(confirm);

    await waitFor(() => expect(getByRole('alert')).toBeVisible());
    expect(getByRole('dialog')).toBeInTheDocument();
  });
});
