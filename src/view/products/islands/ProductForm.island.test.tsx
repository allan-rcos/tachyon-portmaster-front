import { fireEvent, render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { stubLocation } from '@view/core/testing/stub-location';
import { RISK_CLASS_OPTIONS } from '@viewmodel/core/i18n/labels';
import { productFormMessages } from '@viewmodel/products/i18n/product-form.messages';
import { createProduct } from '@viewmodel/products/mutations/create-product.mutation';
import { deleteProduct } from '@viewmodel/products/mutations/delete-product.mutation';
import { updateProduct } from '@viewmodel/products/mutations/update-product.mutation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductForm } from './ProductForm.island';

vi.mock('@viewmodel/products/mutations/create-product.mutation');
vi.mock('@viewmodel/products/mutations/update-product.mutation');
vi.mock('@viewmodel/products/mutations/delete-product.mutation');

const mockedCreate = vi.mocked(createProduct);
const mockedUpdate = vi.mocked(updateProduct);
const mockedDelete = vi.mocked(deleteProduct);

const t = productFormMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
  mockedDelete.mockResolvedValue(undefined);
});
afterEach(() => loc.restore());

describe('ProductForm island', () => {
  it('cria o produto com a densidade já convertida em número', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <ProductForm mode="create" t={t} riskOptions={RISK_CLASS_OPTIONS} />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'Cimento' } });
    fireEvent.input(getByLabelText(t.density), { target: { value: '1.44' } });
    fireEvent.change(getByLabelText(t.riskClass), {
      target: { value: 'Class8CorrosiveSubstances' },
    });
    await user.click(getByRole('button', { name: t.create }));

    await waitFor(() =>
      expect(mockedCreate).toHaveBeenCalledWith({
        name: 'Cimento',
        density: 1.44,
        risk_class: 'Class8CorrosiveSubstances',
      }),
    );
    expect(loc.hrefs).toContain('/painel/produtos');
  });

  it('em modo edição atualiza o produto pelo id, sem criar outro', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <ProductForm
        mode="edit"
        productId="prd_cafe"
        defaultValues={{ name: 'Café', density: 0.67, risk_class: 'None' }}
        t={t}
        riskOptions={RISK_CLASS_OPTIONS}
      />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: 'Café torrado' } });
    await user.click(getByRole('button', { name: t.save }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith(
        'prd_cafe',
        expect.objectContaining({ name: 'Café torrado' }),
      ),
    );
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('só exclui depois da confirmação no diálogo', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(() => (
      <ProductForm
        mode="edit"
        productId="prd_cafe"
        defaultValues={{ name: 'Café', density: 0.67, risk_class: 'None' }}
        t={t}
        riskOptions={RISK_CLASS_OPTIONS}
      />
    ));

    await user.click(getByRole('button', { name: t.delete }));
    expect(mockedDelete).not.toHaveBeenCalled();

    expect(getByRole('dialog')).toBeInTheDocument();
    await user.click(getAllByRole('button', { name: t.delete }).at(-1)!);

    await waitFor(() => expect(mockedDelete).toHaveBeenCalledWith('prd_cafe'));
    expect(loc.hrefs).toContain('/painel/produtos');
  });

  it('não envia quando a validação falha', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <ProductForm mode="create" t={t} riskOptions={RISK_CLASS_OPTIONS} />
    ));

    fireEvent.input(getByLabelText(t.name), { target: { value: '' } });
    fireEvent.input(getByLabelText(t.density), { target: { value: '-1' } });
    await user.click(getByRole('button', { name: t.create }));

    await waitFor(() => expect(mockedCreate).not.toHaveBeenCalled());
  });
});
