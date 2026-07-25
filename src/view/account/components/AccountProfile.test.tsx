import { render } from '@solidjs/testing-library';
import type { AccountProfile as Profile } from '@viewmodel/account/domain';
import { accountMessages } from '@viewmodel/account/i18n/account-page.messages';
import { describe, it, expect } from 'vitest';

import { AccountProfile } from './AccountProfile';


const t = accountMessages('pt-BR');
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
