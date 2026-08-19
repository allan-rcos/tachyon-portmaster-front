// ============================================================
//  O formulário de cadastro, exercitado SEM DOM.
//
//  Substitui a metade "create" de `ProductForm.island.test.tsx`, que montava a
//  island e disparava eventos de `<input>` para chegar até a mutation. Com o
//  estado no ViewModel, validação e submissão são chamadas de função — e o que
//  a island faz (desenhar e encaminhar) tem teste próprio na tela.
// ============================================================
import { riskClassOptions } from '@viewmodel/core/i18n/labels';
import { productNewMessages } from '@viewmodel/products/i18n/product-create-page.messages';
import { createProduct } from '@viewmodel/products/mutations/create-product.mutation';
import { productListPageInput } from '@viewmodel/products/testing/product.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createProductCreateVM, type ProductCreatePageInput } from './product-create-page.vm';

vi.mock('@viewmodel/products/mutations/create-product.mutation');

const mockedCreate = vi.mocked(createProduct);
const t = productNewMessages('pt-BR');

const input: ProductCreatePageInput = {
  meta: { title: t.new, description: t.subtitle },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  listHref: '/painel/produtos',
  riskOptions: riskClassOptions('pt-BR'),
  background: productListPageInput(),
};

beforeEach(() => {
  mockedCreate.mockResolvedValue(undefined as never);
});

describe('createProductCreateVM', () => {
  it('nasce vazio, com a classe de risco em "None"', () => {
    const vm = createProductCreateVM(input);

    expect(vm.value('name')).toBe('');
    expect(vm.value('density')).toBe('');
    expect(vm.value('risk_class')).toBe('None');
    expect(vm.submitting()).toBe(false);
  });

  it('cadastra com a densidade já convertida em número', async () => {
    const vm = createProductCreateVM(input);
    vm.set('name', 'Cimento');
    vm.set('density', '1.44');
    vm.set('risk_class', 'Class8CorrosiveSubstances');

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedCreate).toHaveBeenCalledWith({
      name: 'Cimento',
      density: 1.44,
      risk_class: 'Class8CorrosiveSubstances',
    });
  });

  it('aceita vírgula decimal, que é o que o protótipo mostra', async () => {
    const vm = createProductCreateVM(input);
    vm.set('name', 'Farelo de soja');
    vm.set('density', '0,58');

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedCreate).toHaveBeenCalledWith(expect.objectContaining({ density: 0.58 }));
  });

  it('não envia quando a validação falha, e revela todos os erros de uma vez', async () => {
    const vm = createProductCreateVM(input);
    vm.set('name', '');
    vm.set('density', '-1');

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedCreate).not.toHaveBeenCalled();
    expect(vm.error('name')).toBeDefined();
    expect(vm.error('density')).toBeDefined();
  });

  it('o erro de um campo só aparece depois que ele é tocado', () => {
    const vm = createProductCreateVM(input);
    vm.set('name', 'x');

    expect(vm.error('name')).toBeUndefined();
    vm.blur('name');
    expect(vm.error('name')).toBe(t.nameShort);
  });

  it('falha da API vira estado, não exceção', async () => {
    mockedCreate.mockRejectedValueOnce(new Error('500'));
    const vm = createProductCreateVM(input);
    vm.set('name', 'Cimento');
    vm.set('density', '1.44');

    await expect(vm.submit()).resolves.toBe(false);
    expect(vm.failed()).toBe(true);
    expect(vm.submitting()).toBe(false);
  });

  it('digitar limpa a falha anterior', async () => {
    mockedCreate.mockRejectedValueOnce(new Error('500'));
    const vm = createProductCreateVM(input);
    vm.set('name', 'Cimento');
    vm.set('density', '1.44');
    await vm.submit();
    expect(vm.failed()).toBe(true);

    vm.set('name', 'Cimento Portland');
    expect(vm.failed()).toBe(false);
  });
});
