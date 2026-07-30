// ============================================================
//  A edição de contêiner, exercitada SEM DOM. Substitui a metade "edit" de
//  `ContainerForm.island.test.tsx`.
//
//  O que este arquivo protege, e a versão em island não protegia: o `PATCH`
//  leva SÓ a capacidade. O código do contêiner nem é editável na tela, mas
//  antes nada impedia que ele viajasse no corpo.
// ============================================================
import { containerEditMessages } from '@viewmodel/containers/i18n/container-edit-page.messages';
import { updateContainer } from '@viewmodel/containers/mutations/update-container.mutation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createContainerEditVM, type ContainerEditPageInput } from './container-edit-page.vm';

vi.mock('@viewmodel/containers/mutations/update-container.mutation');

const mockedUpdate = vi.mocked(updateContainer);
const t = containerEditMessages('pt-BR');

const input: ContainerEditPageInput = {
  meta: { title: `${t.edit} — MSKU-4410`, description: t.subtitle },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  id: 'ctr_1',
  code: 'MSKU-4410',
  values: { code: 'MSKU-4410', max_capacity: 28000 },
  listHref: '/painel/conteineres',
};

beforeEach(() => {
  mockedUpdate.mockResolvedValue(undefined as never);
});

describe('createContainerEditVM', () => {
  it('nasce preenchido com o contêiner buscado, capacidade em texto', () => {
    const vm = createContainerEditVM(input);

    expect(vm.value('code')).toBe('MSKU-4410');
    expect(vm.value('max_capacity')).toBe('28000');
  });

  it('envia SÓ a capacidade no PATCH', async () => {
    const vm = createContainerEditVM(input);
    vm.set('max_capacity', '30000');

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedUpdate).toHaveBeenCalledWith('ctr_1', { max_capacity: 30000 });
  });

  it('não envia com capacidade inválida', async () => {
    const vm = createContainerEditVM(input);
    vm.set('max_capacity', '-5');

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedUpdate).not.toHaveBeenCalled();
    expect(vm.error('max_capacity')).toBeDefined();
  });

  it('falha da API vira estado, não exceção', async () => {
    mockedUpdate.mockRejectedValueOnce(new Error('500'));
    const vm = createContainerEditVM(input);

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.failed()).toBe(true);
  });
});
