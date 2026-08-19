// ============================================================
//  O formulário de edição, exercitado SEM DOM. Ver
//  `./product-create-page.vm.test.ts` — aqui o que muda é o formulário nascer
//  preenchido, salvar pelo id e ter `remove()`.
// ============================================================
import { riskClassOptions } from '@viewmodel/core/i18n/labels';
import { productEditMessages } from '@viewmodel/products/i18n/product-edit-page.messages';
import { createProduct } from '@viewmodel/products/mutations/create-product.mutation';
import { deleteProduct } from '@viewmodel/products/mutations/delete-product.mutation';
import { updateProduct } from '@viewmodel/products/mutations/update-product.mutation';
import { productListPageInput } from '@viewmodel/products/testing/product.factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createProductEditVM, type ProductEditPageInput } from './product-edit-page.vm';

vi.mock('@viewmodel/products/mutations/create-product.mutation');
vi.mock('@viewmodel/products/mutations/update-product.mutation');
vi.mock('@viewmodel/products/mutations/delete-product.mutation');

const mockedCreate = vi.mocked(createProduct);
const mockedUpdate = vi.mocked(updateProduct);
const mockedDelete = vi.mocked(deleteProduct);
const t = productEditMessages('pt-BR');

const input: ProductEditPageInput = {
  meta: { title: `${t.edit} — Café`, description: t.subtitle },
  shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
  t,
  id: 'prd_cafe',
  productName: 'Café',
  values: { name: 'Café', density: 0.67, risk_class: 'None' },
  listHref: '/painel/produtos',
  riskOptions: riskClassOptions('pt-BR'),
  background: productListPageInput(),
};

beforeEach(() => {
  mockedUpdate.mockResolvedValue(undefined as never);
  mockedDelete.mockResolvedValue(undefined);
});

describe('createProductEditVM', () => {
  it('nasce preenchido com o produto buscado, densidade em texto', () => {
    const vm = createProductEditVM(input);

    expect(vm.value('name')).toBe('Café');
    expect(vm.value('density')).toBe('0.67');
    expect(vm.value('risk_class')).toBe('None');
  });

  it('atualiza o produto pelo id, sem criar outro', async () => {
    const vm = createProductEditVM(input);
    vm.set('name', 'Café torrado');

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedUpdate).toHaveBeenCalledWith(
      'prd_cafe',
      expect.objectContaining({ name: 'Café torrado' }),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('salva sem edição nenhuma — os valores do servidor já são válidos', async () => {
    const vm = createProductEditVM(input);

    await expect(vm.submit()).resolves.toBe(true);
    expect(mockedUpdate).toHaveBeenCalledWith('prd_cafe', {
      name: 'Café',
      density: 0.67,
      risk_class: 'None',
    });
  });

  it('não envia quando a validação falha', async () => {
    const vm = createProductEditVM(input);
    vm.set('density', '-1');

    await expect(vm.submit()).resolves.toBe(false);
    expect(mockedUpdate).not.toHaveBeenCalled();
    expect(vm.error('density')).toBeDefined();
  });

  it('remove() exclui pelo id e REJEITA na falha — o diálogo trata o erro', async () => {
    const vm = createProductEditVM(input);

    await expect(vm.remove()).resolves.toBeUndefined();
    expect(mockedDelete).toHaveBeenCalledWith('prd_cafe');

    mockedDelete.mockRejectedValueOnce(new Error('409'));
    await expect(vm.remove()).rejects.toThrow('409');
  });
});
