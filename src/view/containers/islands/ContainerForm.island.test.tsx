import { render, waitFor } from '@solidjs/testing-library';
import { setInput, stubLocation } from '@testing/dom';
import userEvent from '@testing-library/user-event';
import { containerFormMessages } from '@viewmodel/containers/i18n/container-form.messages';
import { createContainer } from '@viewmodel/containers/mutations/create-container.mutation';
import { updateContainer } from '@viewmodel/containers/mutations/update-container.mutation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContainerForm } from './ContainerForm.island';

vi.mock('@viewmodel/containers/mutations/create-container.mutation');
vi.mock('@viewmodel/containers/mutations/update-container.mutation');

const mockedCreate = vi.mocked(createContainer);
const mockedUpdate = vi.mocked(updateContainer);

const t = containerFormMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;

beforeEach(() => {
  loc = stubLocation();
});
afterEach(() => loc.restore());

describe('ContainerForm island', () => {
  it('registra o contêiner com a capacidade convertida em número', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <ContainerForm mode="create" t={t} />);

    setInput(getByLabelText(t.code), 'MSKU-9911');
    setInput(getByLabelText(t.maxCapacity), '28000');
    await user.click(getByRole('button', { name: t.create }));

    await waitFor(() =>
      expect(mockedCreate).toHaveBeenCalledWith({ code: 'MSKU-9911', max_capacity: 28000 }),
    );
    expect(loc.hrefs).toContain('/painel/conteineres');
  });

  it('em edição só altera a capacidade — o código é imutável', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole, queryByLabelText } = render(() => (
      <ContainerForm
        mode="edit"
        containerId="ctr_1"
        defaultValues={{ code: 'MSKU-4410', max_capacity: 20000 }}
        t={t}
      />
    ));

    // Em edição o código vira `<output>`, não campo editável.
    expect(queryByLabelText(t.code)).not.toBeInstanceOf(HTMLInputElement);

    setInput(getByLabelText(t.maxCapacity), '32000');
    await user.click(getByRole('button', { name: t.save }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith('ctr_1', { max_capacity: 32000 }),
    );
  });
});
