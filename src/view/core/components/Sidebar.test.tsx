import { render } from '@solidjs/testing-library';
import { shellNav } from '@viewmodel/core/page/shell';
import { pageRequest } from '@viewmodel/core/testing/factory-support';
import { describe, it, expect } from 'vitest';

import { Sidebar } from './Sidebar';

/** A navegação como a rota a entrega — nada é montado no teste. */
const navAt = (url: string, locale?: 'pt-BR' | 'en' | 'es') =>
  shellNav(pageRequest({ url, locale }));

describe('Sidebar', () => {
  it('marca o item ativo com aria-current', () => {
    const { getByRole } = render(() => <Sidebar nav={navAt('/painel/conteineres/ctr_1')} />);
    expect(getByRole('link', { name: /Contêineres/ })).toHaveAttribute('aria-current', 'page');
  });

  it('não marca itens inativos', () => {
    const { getByRole } = render(() => <Sidebar nav={navAt('/painel')} />);
    expect(getByRole('link', { name: /Produtos/ })).not.toHaveAttribute('aria-current');
  });

  it('mostra quem está logado no rodapé, com as iniciais', () => {
    const identity = {
      name: 'Ana Luiza Ferreira',
      role: 'Administrador',
      // Primeira e ÚLTIMA inicial — ver `shellIdentity`.
      initials: 'AF',
      href: '/painel/conta',
    };
    const { getByText, getByRole } = render(() => (
      <Sidebar nav={navAt('/painel')} identity={identity} />
    ));

    expect(getByText('AF')).toBeInTheDocument();
    expect(getByText('Ana Luiza Ferreira')).toBeInTheDocument();
    expect(getByText('Administrador')).toBeInTheDocument();
    expect(getByRole('link', { name: /Ana Luiza Ferreira/ })).toHaveAttribute(
      'href',
      '/painel/conta',
    );
  });

  it('sem sessão resolvida, cai no link simples de conta', () => {
    const nav = navAt('/painel');
    const { getByRole } = render(() => <Sidebar nav={nav} />);
    expect(getByRole('link', { name: nav.accountLabel })).toHaveAttribute('href', '/painel/conta');
  });

  it('não monta rota: os destinos já chegam no idioma da requisição', () => {
    // Era o incômodo que motivou o `shellNav` — a barra montava href e por isso
    // todo o chrome precisava carregar um `locale`.
    const { getByRole } = render(() => <Sidebar nav={navAt('/en/painel', 'en')} />);
    expect(getByRole('link', { name: /Products/ })).toHaveAttribute('href', '/en/painel/produtos');
  });

  it('o seletor de idioma leva à MESMA página nos outros idiomas', () => {
    const { getByRole } = render(() => <Sidebar nav={navAt('/painel/produtos')} />);
    expect(getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en/painel/produtos');
    expect(getByRole('link', { name: 'Español' })).toHaveAttribute('href', '/es/painel/produtos');
  });
});
