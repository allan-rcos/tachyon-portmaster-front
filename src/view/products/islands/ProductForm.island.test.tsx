import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { productFormMessages } from '@viewmodel/products/i18n/product-form.messages';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ProductForm } from './ProductForm.island';

import { setInput, setSelect, stubLocation } from '@/test/utils';

const t = productFormMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('ProductForm island', () => {
  it('cria produto válido e redireciona', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <ProductForm mode="create" t={t} />);
    setInput(getByLabelText(t.name), 'Cimento');
    setInput(getByLabelText(t.density), '1.44');
    setSelect(getByLabelText(t.riskClass), 'Class8CorrosiveSubstances');
    await user.click(getByRole('button', { name: t.create }));
    await waitFor(() => expect(loc.hrefs).toContain('/painel/produtos'));
  });

  it('exclui produto em modo edição', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(() => (
      <ProductForm
        mode="edit"
        productId="prd_cafe"
        defaultValues={{ name: 'Café', density: 0.67, risk_class: 'None' }}
        t={t}
      />
    ));
    await user.click(getByRole('button', { name: t.delete }));
    expect(getByRole('dialog')).toBeInTheDocument();
    await user.click(getAllByRole('button', { name: t.delete }).at(-1)!);
    await waitFor(() => expect(loc.hrefs).toContain('/painel/produtos'));
  });
});
