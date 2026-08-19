import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RouteModal } from './RouteModal.island';

const base = {
  eyebrow: 'Catálogo',
  title: 'Cadastrar produto',
  icon: 'package' as const,
  closeHref: '/painel/produtos',
  closeLabel: 'Fechar',
};

describe('RouteModal', () => {
  it('já nasce aberto — a rota É o estado de aberto', () => {
    render(() => (
      <RouteModal {...base}>
        <p>corpo</p>
      </RouteModal>
    ));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('é rotulado pelo título, para leitor de tela', () => {
    render(() => (
      <RouteModal {...base}>
        <p>corpo</p>
      </RouteModal>
    ));
    expect(screen.getByRole('dialog')).toHaveAccessibleName(base.title);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('fechar é um LINK para a listagem — funciona sem JS', () => {
    render(() => (
      <RouteModal {...base}>
        <p>corpo</p>
      </RouteModal>
    ));
    const close = screen.getByRole('link', { name: base.closeLabel });
    expect(close).toHaveAttribute('href', '/painel/produtos');
  });

  it('mostra sobrescrita e título, e desenha o corpo', () => {
    render(() => (
      <RouteModal {...base}>
        <p>formulário aqui</p>
      </RouteModal>
    ));
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar produto')).toBeInTheDocument();
    expect(screen.getByText('formulário aqui')).toBeInTheDocument();
  });

  it('trava a rolagem do fundo enquanto está aberto, e devolve ao sair', () => {
    const { unmount } = render(() => (
      <RouteModal {...base}>
        <p>corpo</p>
      </RouteModal>
    ));
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('leva o foco para o diálogo, tirando-o da listagem de trás', () => {
    render(() => (
      <RouteModal {...base}>
        <p>corpo</p>
      </RouteModal>
    ));
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('clique DENTRO do diálogo não fecha', async () => {
    const user = userEvent.setup();
    render(() => (
      <RouteModal {...base}>
        <p>corpo</p>
      </RouteModal>
    ));
    await user.click(screen.getByText('corpo'));
    expect(screen.getByText('corpo')).toBeInTheDocument();
  });
});
