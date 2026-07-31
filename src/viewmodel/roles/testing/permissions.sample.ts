import type { Permission } from '@model/common/dto';

/**
 * Slugs plausíveis para as factories sortearem.
 *
 * É AMOSTRA, não catálogo: a lista de verdade vive no backend, e o que existe
 * aqui só precisa parecer com ela o bastante para um teste. Ficou em `testing/`
 * exatamente para que ninguém a confunda com a fonte da verdade — nenhum código
 * de produção pode importá-la.
 */
export const SAMPLE_PERMISSIONS: readonly Permission[] = [
  'product:read',
  'product:create',
  'product:update',
  'product:delete',
  'container:read',
  'container:create',
  'container:seal',
  'container:dispatch',
  'container:summary',
  'manifest:load',
  'manifest:unload',
  'user:get',
  'user:list',
  'user:create',
  'user:update',
  'role:list',
  'role:create',
  'role:update_permissions',
  'metrics:read',
];
