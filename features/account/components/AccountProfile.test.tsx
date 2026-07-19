import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { AccountProfile } from './AccountProfile';

import type { AccountProfile as Profile } from '@/services/gen/flow/v1/account';
import ptBR from '@/shared/i18n/messages/pt-BR';

const t = { ...ptBR.common, ...ptBR.account };
const profile: Profile = {
  id: 'usr_1',
  name: 'Ana Marés',
  email: 'ana@x.com',
  roles: [
    { id: 'r1', name: 'Administrador', user_count: 1, permissions: ['MetricsRead', 'UserList'] },
  ],
};

describe('AccountProfile', () => {
  it('mostra identidade e perfis com contagem de permissões', () => {
    const { getByText } = render(() => <AccountProfile profile={profile} t={t} />);
    expect(getByText('Ana Marés')).toBeInTheDocument();
    expect(getByText('Administrador')).toBeInTheDocument();
    expect(getByText(/2 permissões/)).toBeInTheDocument();
  });
});
