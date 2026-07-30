// ============================================================
//  O rodapé de paginação: o botão é o caminho garantido (sem JS, sem
//  IntersectionObserver), e o observador só antecipa o clique. O jsdom não
//  implementa IntersectionObserver, o que é conveniente — este teste exercita
//  exatamente o caminho de fallback.
// ============================================================
import { fireEvent, getByRole, queryByRole } from '@testing-library/dom';
import { island } from '@view/core/island/mount';
import { html, render } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import { InfiniteList, type InfiniteListProps } from './InfiniteList.island';

const noop = async () => {};

const base = {
  isLoading: false,
  loadMore: noop,
  retry: noop,
  loadMoreLabel: 'Carregar mais',
  retryLabel: 'Tentar de novo',
};

function mount(props: InfiniteListProps): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  render(html`${island(InfiniteList, props)}`, el);
  return el;
}

describe('InfiniteList', () => {
  it('não mostra nada quando acabou a paginação', () => {
    const el = mount({ ...base, hasMore: false });
    expect(queryByRole(el, 'button')).toBeNull();
  });

  it('chama o handler do ViewModel ao clicar', () => {
    const loadMore = vi.fn(noop);
    const el = mount({ ...base, hasMore: true, loadMore });

    fireEvent.click(getByRole(el, 'button', { name: 'Carregar mais' }));
    expect(loadMore).toHaveBeenCalledOnce();
  });

  it('com erro, troca o botão de paginar pelo de tentar de novo', () => {
    const retry = vi.fn(noop);
    const el = mount({ ...base, hasMore: true, error: 'Falhou', retry });

    expect(getByRole(el, 'alert')).toHaveTextContent('Falhou');
    expect(queryByRole(el, 'button', { name: 'Carregar mais' })).toBeNull();

    fireEvent.click(getByRole(el, 'button', { name: 'Tentar de novo' }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it('desabilita o botão enquanto a página está em voo', () => {
    const el = mount({ ...base, hasMore: true, isLoading: true });
    expect(getByRole(el, 'button', { name: 'Carregar mais' })).toBeDisabled();
  });
});
