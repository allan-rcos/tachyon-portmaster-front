import type { ApiClient } from '@model/core/http';
import { wire } from '@model/core/wire';

import type { PermissionList } from './dto';
import { decPermissionList } from './fbs';

/**
 * Catálogo de permissões registradas.
 *
 * @param c      Cliente HTTP configurado.
 * @param search Filtra por slug; ausente devolve o catálogo inteiro.
 */
export const listPermissions = (c: ApiClient, search?: string): Promise<PermissionList> =>
  wire(c, {
    method: 'GET',
    path: '/v1/metadata/permissions',
    query: search ? { search } : undefined,
    decode: decPermissionList,
  });
