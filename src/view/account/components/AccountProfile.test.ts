import { getByText } from '@testing-library/dom';
import { accountMessages } from '@viewmodel/account/i18n/account-page.messages';
import type { AccountProfileVM } from '@viewmodel/account/vm-contracts';
import { render } from 'lit';
import { describe, expect, it } from 'vitest';

import { AccountProfile } from './AccountProfile';

/** VM de mentira: só os campos que o componente lê. */
function vm(): AccountProfileVM {
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
    const el = document.createElement('div');
    document.body.append(el);
    render(AccountProfile({ vm: vm() }), el);

    expect(getByText(el, 'Allan Costa')).toBeInTheDocument();
    expect(getByText(el, 'allan@portmaster.test')).toBeInTheDocument();
    expect(getByText(el, 'Administrador')).toBeInTheDocument();
    expect(getByText(el, '12 permissões')).toBeInTheDocument();
  });
});
