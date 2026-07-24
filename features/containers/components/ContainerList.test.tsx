import { render } from '@solidjs/testing-library';
import type { Container } from 'tachyon-portmaster-sdk/containers';
import { describe, it, expect } from 'vitest';

import { ContainerList } from './ContainerList';

import { containersListMessages } from '@/pages/painel/conteineres/messages';

const t = containersListMessages('pt-BR');
const items: Container[] = [
  { id: 'ctr_1', code: 'MSKU-4410', current_weight: 12000, max_capacity: 28000, status: 'Loading' },
  { id: 'ctr_2', code: 'TCLU-9982', current_weight: 20000, max_capacity: 24000, status: 'Sealed' },
];

describe('ContainerList', () => {
  it('renderiza linhas com link para o resumo e ação de novo', () => {
    const { getByRole } = render(() => (
      <ContainerList items={items} total={2} filters={{ search: '', status: '' }} t={t} />
    ));
    expect(getByRole('link', { name: 'MSKU-4410' })).toHaveAttribute(
      'href',
      '/painel/conteineres/ctr_1',
    );
    expect(getByRole('link', { name: new RegExp(t.new) })).toHaveAttribute(
      'href',
      '/painel/conteineres/nova',
    );
  });

  it('mostra estado vazio quando não há itens', () => {
    const { getByText } = render(() => (
      <ContainerList items={[]} total={0} filters={{ search: '', status: '' }} t={t} />
    ));
    expect(getByText(t.empty)).toBeInTheDocument();
  });

  it('preserva filtros no link de próxima página', () => {
    const { getByRole } = render(() => (
      <ContainerList
        items={items}
        total={20}
        nextCursor="8"
        filters={{ search: 'ms', status: 'Loading' }}
        t={t}
      />
    ));
    const next = getByRole('link', { name: new RegExp(t.next) });
    expect(next.getAttribute('href')).toContain('cursor=8');
    expect(next.getAttribute('href')).toContain('search=ms');
    expect(next.getAttribute('href')).toContain('status=Loading');
  });
});
