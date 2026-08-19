// ============================================================
//  O formulário de registro de contêiner, exercitado SEM DOM. Substitui a
//  metade "create" de `ContainerForm.island.test.tsx`.
//
//  Ver `@viewmodel/products/product-create-page.vm.test` para o modelo.
// ============================================================
import { containerNewMessages } from '@viewmodel/containers/i18n/container-create-page.messages';
import { createContainer } from '@viewmodel/containers/mutations/create-container.mutation';
import { containerListPageInput } from '@viewmodel/containers/testing/container.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createContainerCreateVM, type ContainerCreatePageInput } from './container-create-page.vm';

vi.mock('@viewmodel/containers/mutations/create-container.mutation');

const mockedCreate = vi.mocked(createContainer);
const t = containerNewMessages('pt-BR');

const input: ContainerCreatePageInput = {
  meta: { title: t.new, description: t.subtitle },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  listHref: '/painel/conteineres',
  background: containerListPageInput(),
};

beforeEach(() => {
  mockedCreate.mockResolvedValue(undefined as never);
});

describe('createContainerCreateVM', () => {
  it('registra o contêiner com a capacidade convertida em número', async () => {
    const vm = createContainerCreateVM(input);
    vm.set('code', 'MSKU-4410');
    vm.set('max_capacity', '28000');

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedCreate).toHaveBeenCalledWith({ code: 'MSKU-4410', max_capacity: 28000 });
  });

  it('recusa código com caractere fora de letra, número e hífen', async () => {
    const vm = createContainerCreateVM(input);
    vm.set('code', 'MSKU 4410');
    vm.set('max_capacity', '28000');

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedCreate).not.toHaveBeenCalled();
    expect(vm.error('code')).toBe(t.codeFormat);
  });

  it('recusa capacidade não positiva', async () => {
    const vm = createContainerCreateVM(input);
    vm.set('code', 'MSKU-4410');
    vm.set('max_capacity', '0');

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.error('max_capacity')).toBe(t.capacityPositive);
  });

  it('o erro de um campo só aparece depois que ele é tocado', () => {
    const vm = createContainerCreateVM(input);
    vm.set('code', 'ab');

    expect(vm.error('code')).toBeUndefined();
    vm.blur('code');
    expect(vm.error('code')).toBe(t.codeShort);
  });

  it('falha da API vira estado, não exceção', async () => {
    mockedCreate.mockRejectedValueOnce(new Error('409'));
    const vm = createContainerCreateVM(input);
    vm.set('code', 'MSKU-4410');
    vm.set('max_capacity', '28000');

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.failed()).toBe(true);
    expect(vm.submitting()).toBe(false);
  });
});
