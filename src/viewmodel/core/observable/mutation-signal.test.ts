import { describe, expect, it, vi } from 'vitest';

import { createMutationSignal } from './mutation-signal';

describe('createMutationSignal', () => {
  it('começa ocioso', () => {
    const mutation = createMutationSignal(async (n: number) => n * 2);

    expect(mutation.status()).toBe('idle');
    expect(mutation.isPending()).toBe(false);
    expect(mutation.isError()).toBe(false);
    expect(mutation.isSuccess()).toBe(false);
  });

  it('publica o resultado e chama onSuccess', async () => {
    const onSuccess = vi.fn();
    const mutation = createMutationSignal(async (n: number) => n * 2, { onSuccess });

    await mutation.mutate(21);

    expect(mutation.status()).toBe('success');
    expect(mutation.isSuccess()).toBe(true);
    expect(mutation.data()).toBe(42);
    expect(onSuccess).toHaveBeenCalledWith(42);
  });

  it('NUNCA rejeita — a falha vira estado observável', async () => {
    // É o que permite chamar `mutate` direto no handler de submit sem gerar
    // unhandled rejection quando a API recusa.
    const mutation = createMutationSignal(async () => {
      throw new Error('422');
    });

    await expect(mutation.mutate(undefined)).resolves.toBeUndefined();
    expect(mutation.isError()).toBe(true);
    expect(mutation.error()?.message).toBe('422');
  });

  it('não chama onSuccess quando a mutação falha', async () => {
    const onSuccess = vi.fn();
    const mutation = createMutationSignal(
      async () => {
        throw new Error('falhou');
      },
      { onSuccess },
    );

    await mutation.mutate(undefined);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('limpa o erro anterior ao tentar de novo', async () => {
    const run = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('primeira'))
      .mockResolvedValueOnce('segunda');
    const mutation = createMutationSignal(run);

    await mutation.mutate(undefined);
    expect(mutation.isError()).toBe(true);

    await mutation.mutate(undefined);
    expect(mutation.isError()).toBe(false);
    expect(mutation.error()).toBeUndefined();
    expect(mutation.data()).toBe('segunda');
  });

  it('repassa a entrada para a função de mutação', async () => {
    const run = vi.fn(async (input: { name: string }) => input.name);
    const mutation = createMutationSignal(run);

    await mutation.mutate({ name: 'Cimento' });
    expect(run).toHaveBeenCalledWith({ name: 'Cimento' });
  });
});
