import { render } from '@solidjs/testing-library';
import type { AccountPageVM } from '@viewmodel/account/account-page.vm';
import { accountMessages } from '@viewmodel/account/i18n/account-page.messages';
import { describe, it, expect } from 'vitest';

import { AccountProfile } from './AccountProfile';

/** VM de mentira: só os campos que o componente lê. */
function vm(): AccountPageVM {
  // `permissionsCount` é função e não atravessa o `PageInput` — o VM recebe o
  // texto sem ela, com a contagem já resolvida em `roles[].permissionsLabel`.
  const { permissionsCount, ...t } = accountMessages('pt-BR');
  void permissionsCount;
  return {
    t,
    identity: { name: 'Allan Costa', email: 'allan@portmaster.test' },
    roles: [{ id: 'rol_1', name: 'Administrador', permissionsLabel: '12 permissões' }],
  };
}

describe('AccountProfile', () => {
  it('mostra identidade e perfis com a contagem já escrita', () => {
    const { getByText } = render(() => <AccountProfile vm={vm()} />);

    expect(getByText('Allan Costa')).toBeInTheDocument();
    expect(getByText('allan@portmaster.test')).toBeInTheDocument();
    expect(getByText('Administrador')).toBeInTheDocument();
    expect(getByText('12 permissões')).toBeInTheDocument();
  });
});
