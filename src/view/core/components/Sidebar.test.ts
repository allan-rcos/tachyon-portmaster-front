import { getByRole, getByText } from '@testing-library/dom';
import { commonText, navText } from '@viewmodel/core/i18n/common';
import { render } from 'lit';
import { describe, expect, it } from 'vitest';

import { Sidebar, type ShellNavText } from './Sidebar';

const nav: ShellNavText = { ...navText('pt-BR'), logout: commonText('pt-BR').logout };

function mount(props: Parameters<typeof Sidebar>[0]): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(Sidebar(props), el);
  return el;
}

describe('Sidebar', () => {
  it('marca o item ativo com aria-current', () => {
    const el = mount({ currentPath: '/painel/conteineres/ctr_1', nav });
    expect(getByRole(el, 'link', { name: /Contêineres/ })).toHaveAttribute('aria-current', 'page');
  });

  it('não marca itens inativos', () => {
    const el = mount({ currentPath: '/painel', nav });
    expect(getByRole(el, 'link', { name: /Produtos/ })).not.toHaveAttribute('aria-current');
  });

  it('mostra quem está logado no rodapé, com as iniciais', () => {
    const identity = {
      name: 'Ana Luiza Ferreira',
      role: 'Administrador',
      // Primeira e ÚLTIMA inicial — ver `shellIdentity`.
      initials: 'AF',
      href: '/painel/conta',
    };
    const el = mount({ currentPath: '/painel', nav, identity });

    expect(getByText(el, 'AF')).toBeInTheDocument();
    expect(getByText(el, 'Ana Luiza Ferreira')).toBeInTheDocument();
    expect(getByText(el, 'Administrador')).toBeInTheDocument();
    expect(getByRole(el, 'link', { name: /Ana Luiza Ferreira/ })).toHaveAttribute(
      'href',
      '/painel/conta',
    );
  });

  it('sem sessão resolvida, cai no link simples de conta', () => {
    const el = mount({ currentPath: '/painel', nav });
    expect(getByRole(el, 'link', { name: nav.conta })).toHaveAttribute('href', '/painel/conta');
  });
});
