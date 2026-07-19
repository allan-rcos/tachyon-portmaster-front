import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { RoleList } from './RoleList';

import type { Role } from '@/services/gen/flow/v1/admin';
import ptBR from '@/shared/i18n/messages/pt-BR';

const t = { ...ptBR.common, ...ptBR.roles };
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
