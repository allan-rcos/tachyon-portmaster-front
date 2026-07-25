import type { ContainerStatus } from '@viewmodel/core/domain';
import { CONTAINER_STATUS_LABEL, CONTAINER_STATUS_TONE } from '@viewmodel/core/i18n/labels';
import type { JSX } from 'solid-js';

import { Badge } from './Badge';


/** Selo de status de contêiner (rótulo + tom pt-BR). */
export function StatusBadge(props: { status: ContainerStatus }): JSX.Element {
  return (
    <Badge tone={CONTAINER_STATUS_TONE[props.status]} dot>
      {CONTAINER_STATUS_LABEL[props.status]}
    </Badge>
  );
}
