import { getAllByRole, getByRole, queryByRole, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { island } from '@view/core/island/mount';
import { effect, signal } from 'alien-signals';
import { html, render } from 'lit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog.island';

const base = {
  triggerLabel: 'Lacrar',
  title: 'Lacrar contêiner',
  message: 'Confirma?',
  confirmLabel: 'Lacrar',
  cancelLabel: 'Cancelar',
};

let stop: (() => void) | undefined;
afterEach(() => {
  stop?.();
  stop = undefined;
});

/**
 * Monta o island como a página o monta: pela diretiva `island()`, dentro do
 * effect raiz. É o effect que devolve o re-render quando um `signal` do island
 * muda — sem ele o diálogo abriria no estado e não na tela.
 */
function mount(props: ConfirmDialogProps): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  // Corpo em BLOCO: o `effect` do alien-signals trata o retorno como função de
  // limpeza, e o `render` do lit devolve um `RootPart`.
  stop = effect(() => {
    render(html`${island(ConfirmDialog, props)}`, el);
  });
  return el;
}

describe('ConfirmDialog', () => {
  it('abre, confirma e chama onConfirm + onDone', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onDone = vi.fn();
    const el = mount({ ...base, onConfirm, onDone });

    await user.click(getByRole(el, 'button', { name: 'Lacrar' }));
    expect(getByRole(el, 'dialog')).toBeInTheDocument();

    await user.click(getAllByRole(el, 'button', { name: 'Lacrar' }).at(-1)!);
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
    expect(onDone).toHaveBeenCalledOnce();
    await waitFor(() => expect(queryByRole(el, 'dialog')).toBeNull());
  });

  it('mostra erro e mantém o diálogo aberto quando onConfirm falha', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockRejectedValue(new Error('x'));
    const el = mount({ ...base, onConfirm });

    await user.click(getByRole(el, 'button', { name: 'Lacrar' }));
    await user.click(getAllByRole(el, 'button', { name: 'Lacrar' }).at(-1)!);

    await waitFor(() => expect(getByRole(el, 'alert')).toBeVisible());
    expect(getByRole(el, 'dialog')).toBeInTheDocument();
  });

  it('o estado do diálogo sobrevive a props novas', async () => {
    const user = userEvent.setup();
    const props = { ...base, onConfirm: vi.fn().mockResolvedValue(undefined) };
    // A prop vem de um `signal` para simular o que a página faz: um dado do
    // ViewModel muda e o effect raiz reavalia o template inteiro.
    const message = signal('Confirma?');

    const el = document.createElement('div');
    document.body.append(el);
    stop = effect(() => {
      render(html`${island(ConfirmDialog, { ...props, message: message() })}`, el);
    });

    await user.click(getByRole(el, 'button', { name: 'Lacrar' }));
    expect(getByRole(el, 'dialog')).toBeInTheDocument();

    // Mesma posição de template → mesma instância de diretiva → mesmo island.
    // Se o island fosse recriado, `#open` voltaria a `false` e o diálogo sumiria.
    message('Confirma mesmo?');
    await waitFor(() => expect(getByRole(el, 'dialog')).toHaveTextContent('Confirma mesmo?'));
  });
});
