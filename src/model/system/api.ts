import type { ApiClient } from '@model/core/http';
import { wire } from '@model/core/wire';

import type { ProjectInfo } from './dto';
import { decProjectInfo } from './fbs';

/**
 * GET /v1/info — metadados do processo do backend. Rota pública.
 *
 * @param c Cliente HTTP configurado.
 */
export const getProjectInfo = (c: ApiClient): Promise<ProjectInfo> =>
  wire(c, { method: 'GET', path: '/v1/info', decode: decProjectInfo });
