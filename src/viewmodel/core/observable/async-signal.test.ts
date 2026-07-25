import { describe, expect, it, vi } from 'vitest';

import { createAsyncSignal } from './async-signal';

/** Promise controlável, para orquestrar a ordem de resolução nos testes. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('createAsyncSignal', () => {
  it('começa ocioso, com o valor inicial e sem erro', () => {
    const resource = createAsyncSignal(async () => 'pronto', 'inicial');

    expect(resource.status()).toBe('idle');
    expect(resource.data()).toBe('inicial');
    expect(resource.error()).toBeUndefined();
    expect(resource.isLoading()).toBe(false);
  });

  it('marca carregando durante a busca e publica o dado ao concluir', async () => {
    const gate = deferred<string>();
    const resource = createAsyncSignal(() => gate.promise);

    const running = resource.run();
    expect(resource.status()).toBe('loading');
    expect(resource.isLoading()).toBe(true);

    gate.resolve('carregado');
    await running;

    expect(resource.status()).toBe('success');
    expect(resource.data()).toBe('carregado');
    expect(resource.isLoading()).toBe(false);
  });

  it('converte a falha em estado em vez de rejeitar', async () => {
    const resource = createAsyncSignal(async () => {
      throw new Error('caiu');
    });

    await expect(resource.run()).resolves.toBeUndefined();
    expect(resource.status()).toBe('error');
    expect(resource.error()).toMatchObject({ message: 'caiu' });
  });

  it('normaliza rejeição que não é Error', async () => {
    const resource = createAsyncSignal(async () => {
      throw 'string crua';
    });

    await resource.run();
    expect(resource.error()).toBeInstanceOf(Error);
    expect(resource.error()?.message).toBe('string crua');
  });

  it('descarta a resposta obsoleta quando uma nova carga começa antes', async () => {
    // É o caso do filtro digitado rápido: a primeira busca responde DEPOIS da
    // segunda. Sem o descarte, a tela terminaria mostrando o resultado antigo.
    const first = deferred<string>();
    const second = deferred<string>();
    const fetcher = vi
      .fn<() => Promise<string>>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const resource = createAsyncSignal(fetcher);
    const firstRun = resource.run();
    const secondRun = resource.run();

    second.resolve('resposta nova');
    await secondRun;
    expect(resource.data()).toBe('resposta nova');

    first.resolve('resposta velha');
    await firstRun;

    expect(resource.data()).toBe('resposta nova');
    expect(resource.status()).toBe('success');
  });

  it('descarta também o erro obsoleto, para não sujar uma carga bem-sucedida', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const fetcher = vi
      .fn<() => Promise<string>>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const resource = createAsyncSignal(fetcher);
    const firstRun = resource.run();
    const secondRun = resource.run();

    second.resolve('ok');
    await secondRun;

    first.reject(new Error('falha antiga'));
    await firstRun;

    expect(resource.status()).toBe('success');
    expect(resource.error()).toBeUndefined();
  });

  it('limpa o erro anterior ao recarregar', async () => {
    const fetcher = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('falhou'))
      .mockResolvedValueOnce('deu certo');

    const resource = createAsyncSignal(fetcher);
    await resource.run();
    expect(resource.error()).toBeDefined();

    await resource.run();
    expect(resource.error()).toBeUndefined();
    expect(resource.data()).toBe('deu certo');
  });

  it('repassa os argumentos de `run` para a função de busca', async () => {
    const fetcher = vi.fn(async (limit: number) => `limite ${limit}`);
    const resource = createAsyncSignal(fetcher);

    await resource.run(25);
    expect(fetcher).toHaveBeenCalledWith(25);
    expect(resource.data()).toBe('limite 25');
  });
});
