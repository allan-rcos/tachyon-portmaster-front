import { render } from '@solidjs/testing-library';
import type { Role } from 'tachyon-portmaster-sdk/roles';
import { describe, it, expect } from 'vitest';

import { RoleList } from './RoleList';

import { rolesListMessages } from '@/pages/painel/perfis/messages';

const t = rolesListMessages('pt-BR');
const items: Role[] = [
  { id: 'rol_1', name: 'Administrador', user_count: 1, permissions: ['MetricsRead', 'UserList'] },
];

describe('RoleList', () => {
  it('lista perfis com link para permissões', () => {
    const { getByRole } = render(() => <RoleList items={items} total={1} t={t} />);
    expect(getByRole('link', { name: 'Administrador' })).toHaveAttribute(
      'href',
      '/painel/perfis/rol_1/permissoes',
    );
  });
});
