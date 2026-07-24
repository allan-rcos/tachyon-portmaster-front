import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ContainerForm } from './ContainerForm.island';
import { containerFormMessages } from './ContainerForm.messages';

import { setInput, stubLocation } from '@/test/utils';

const t = containerFormMessages('pt-BR');
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('ContainerForm island', () => {
  it('cria contêiner válido e redireciona para a lista', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <ContainerForm mode="create" t={t} />);
    setInput(getByLabelText(t.code), 'ZZZU-1234');
    setInput(getByLabelText(t.maxCapacity), '15000');
    await user.click(getByRole('button', { name: t.create }));
    await waitFor(() => expect(loc.hrefs).toContain('/painel/conteineres'));
  });

  it('bloqueia submit com código inválido', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => <ContainerForm mode="create" t={t} />);
    setInput(getByLabelText(t.code), 'ab');
    setInput(getByLabelText(t.maxCapacity), '15000');
    await user.click(getByRole('button', { name: t.create }));
    await new Promise((r) => setTimeout(r, 150));
    expect(loc.hrefs).not.toContain('/painel/conteineres');
  });

  it('edita capacidade e redireciona', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(() => (
      <ContainerForm
        mode="edit"
        containerId="ctr_gesu0517"
        defaultValues={{ code: 'GESU-0517', max_capacity: 26000 }}
        t={t}
      />
    ));
    setInput(getByLabelText(t.maxCapacity), '30000');
    await user.click(getByRole('button', { name: t.save }));
    await waitFor(() => expect(loc.hrefs).toContain('/painel/conteineres'));
  });
});
