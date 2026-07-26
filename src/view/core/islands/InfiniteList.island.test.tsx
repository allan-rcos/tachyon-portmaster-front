// ============================================================
//  O rodapé de paginação: o botão é o caminho garantido (sem JS, sem
//  IntersectionObserver), e o observador só antecipa o clique. O jsdom não
//  implementa IntersectionObserver, o que é conveniente — este teste exercita
//  exatamente o caminho de fallback.
// ============================================================
import { fireEvent, render } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';

import { InfiniteList } from './InfiniteList.island';

const noop = async () => {};

describe('InfiniteList', () => {
  it('não mostra nada quando acabou a paginação', () => {
    const { queryByRole } = render(() => (
      <InfiniteList
        hasMore={false}
        isLoading={false}
        loadMore={noop}
        retry={noop}
        loadMoreLabel="Carregar mais"
        retryLabel="Tentar de novo"
      />
    ));
    expect(queryByRole('button')).toBeNull();
  });

  it('chama o handler do ViewModel ao clicar', () => {
    const loadMore = vi.fn(noop);
    const { getByRole } = render(() => (
      <InfiniteList
        hasMore
        isLoading={false}
        loadMore={loadMore}
        retry={noop}
        loadMoreLabel="Carregar mais"
        retryLabel="Tentar de novo"
      />
    ));

    fireEvent.click(getByRole('button', { name: 'Carregar mais' }));
    expect(loadMore).toHaveBeenCalledOnce();
  });

  it('com erro, troca o botão de paginar pelo de tentar de novo', () => {
    const retry = vi.fn(noop);
    const { getByRole, queryByRole } = render(() => (
      <InfiniteList
        hasMore
        isLoading={false}
        error="Falhou"
        loadMore={noop}
        retry={retry}
        loadMoreLabel="Carregar mais"
        retryLabel="Tentar de novo"
      />
    ));

    expect(getByRole('alert')).toHaveTextContent('Falhou');
    expect(queryByRole('button', { name: 'Carregar mais' })).toBeNull();

    fireEvent.click(getByRole('button', { name: 'Tentar de novo' }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it('desabilita o botão enquanto a página está em voo', () => {
    const { getByRole } = render(() => (
      <InfiniteList
        hasMore
        isLoading
        loadMore={noop}
        retry={noop}
        loadMoreLabel="Carregar mais"
        retryLabel="Tentar de novo"
      />
    ));
    expect(getByRole('button', { name: 'Carregar mais' })).toBeDisabled();
  });
});
