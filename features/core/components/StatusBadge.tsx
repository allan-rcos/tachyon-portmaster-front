import type { JSX } from 'solid-js';
import type { ContainerStatus } from 'tachyon-portmaster-sdk/common';

import { Badge } from './Badge';

import { CONTAINER_STATUS_LABEL, CONTAINER_STATUS_TONE } from '@/features/core/i18n/labels';

/** Selo de status de contêiner (rótulo + tom pt-BR). */
export function StatusBadge(props: { status: ContainerStatus }): JSX.Element {
  return (
    <Badge tone={CONTAINER_STATUS_TONE[props.status]} dot>
      {CONTAINER_STATUS_LABEL[props.status]}
    </Badge>
  );
}
