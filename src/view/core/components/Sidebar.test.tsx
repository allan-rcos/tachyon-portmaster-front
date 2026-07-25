import { render } from '@solidjs/testing-library';
import { commonText, navText } from '@viewmodel/core/i18n/common';
import { describe, it, expect } from 'vitest';

import { Sidebar, type ShellNavText } from './Sidebar';

const nav: ShellNavText = { ...navText('pt-BR'), logout: commonText('pt-BR').logout };

describe('Sidebar', () => {
  it('marca o item ativo com aria-current', () => {
    const { getByRole } = render(() => (
      <Sidebar currentPath="/painel/conteineres/ctr_1" nav={nav} />
    ));
    const link = getByRole('link', { name: /Contêineres/ });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('não marca itens inativos', () => {
    const { getByRole } = render(() => <Sidebar currentPath="/painel" nav={nav} />);
    expect(getByRole('link', { name: /Produtos/ })).not.toHaveAttribute('aria-current');
  });
});
