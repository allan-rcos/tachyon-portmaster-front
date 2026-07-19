import type { JSX } from 'solid-js';

import { Badge } from './Badge';

import type { ContainerStatus } from '@/services/gen/flow/v1/common';
import { CONTAINER_STATUS_LABEL, CONTAINER_STATUS_TONE } from '@/shared/i18n/labels';

/** Selo de status de contêiner (rótulo + tom pt-BR). */
export function StatusBadge(props: { status: ContainerStatus }): JSX.Element {
  return (
    <Badge tone={CONTAINER_STATUS_TONE[props.status]} dot>
      {CONTAINER_STATUS_LABEL[props.status]}
    </Badge>
  );
}
