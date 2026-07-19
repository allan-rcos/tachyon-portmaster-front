import { render, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ContainerActions } from './ContainerActions.island';

import ptBR from '@/shared/i18n/messages/pt-BR';
import { stubLocation } from '@/test/utils';

const t = { ...ptBR.common, ...ptBR.containers };
let loc: ReturnType<typeof stubLocation>;
beforeEach(() => {
  loc = stubLocation();
  document.cookie = 'auth_token=mock_usr_ana; path=/';
});
afterEach(() => loc.restore());

describe('ContainerActions island', () => {
  it('mostra lacrar/excluir para status Loading e não mostra despachar', () => {
    const { getByRole, queryByRole } = render(() => (
      <ContainerActions containerId="ctr_gesu0517" status="Loading" t={t} />
    ));
    expect(getByRole('button', { name: t.seal })).toBeInTheDocument();
    expect(getByRole('button', { name: t.delete })).toBeInTheDocument();
    expect(queryByRole('button', { name: t.dispatch })).toBeNull();
  });

  it('lacra o contêiner após confirmação e recarrega', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = render(() => (
      <ContainerActions containerId="ctr_gesu0517" status="Loading" t={t} />
    ));
    await user.click(getByRole('button', { name: t.seal }));
    expect(getByRole('dialog')).toBeInTheDocument();
    await user.click(getAllByRole('button', { name: t.seal }).at(-1)!);
    await waitFor(() => expect(loc.reloads()).toBeGreaterThan(0));
  });

  it('mostra despachar para status Sealed', () => {
    const { getByRole } = render(() => (
      <ContainerActions containerId="ctr_x" status="Sealed" t={t} />
    ));
    expect(getByRole('button', { name: t.dispatch })).toBeInTheDocument();
  });
});
