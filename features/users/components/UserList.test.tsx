import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { UserList } from './UserList';

import type { UserAdmin } from '@/services/gen/flow/v1/admin';
import ptBR from '@/shared/i18n/messages/pt-BR';

const t = { ...ptBR.common, ...ptBR.users };
const items: UserAdmin[] = [
  {
    id: 'usr_1',
    name: 'Ana Marés',
    email: 'ana@x.com',
    roles: [{ id: 'r1', name: 'Administrador', user_count: 1, permissions: [] }],
  },
];

describe('UserList', () => {
  it('lista usuários com perfis e link de edição', () => {
    const { getByRole, getByText } = render(() => <UserList items={items} total={1} t={t} />);
    expect(getByRole('link', { name: 'Ana Marés' })).toHaveAttribute(
      'href',
      '/painel/usuarios/usr_1/editar',
    );
    expect(getByText('Administrador')).toBeInTheDocument();
  });
});
