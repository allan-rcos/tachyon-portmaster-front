import { For, Show, type JSX } from 'solid-js';
import type { TelemetryEvent } from 'tachyon-portmaster-sdk/common';
import type { TelemetryLogItem } from 'tachyon-portmaster-sdk/containers';

import type { ContainerDetailText } from './ContainerSummary';
import styles from './TelemetryLog.module.scss';

import { Badge } from '@/features/core/components/Badge';
import type { Tone } from '@/features/core/i18n/labels';
import { TELEMETRY_EVENT_LABEL } from '@/features/core/i18n/labels';
import { formatDateTime } from '@/features/core/utils/formatters';

const EVENT_TONE: Record<TelemetryEvent, Tone> = {
  Create: 'neutral',
  Load: 'gold',
  Unload: 'orange',
  Seal: 'sage',
  Dispatch: 'teal',
};

/** Linha do tempo de telemetria (SSR). */
export function TelemetryLog(props: {
  logs: TelemetryLogItem[];
  t: ContainerDetailText;
}): JSX.Element {
  return (
    <Show when={props.logs.length > 0} fallback={<p class={styles.empty}>{props.t.empty}</p>}>
      <ol class={styles.list}>
        <For each={props.logs}>
          {(log) => (
            <li class={styles.item}>
              <Badge tone={EVENT_TONE[log.event]}>{TELEMETRY_EVENT_LABEL[log.event]}</Badge>
              <div class={styles.body}>
                <p class={styles.desc}>{log.description}</p>
                <time class={styles.time} datetime={log.timestamp}>
                  {formatDateTime(log.timestamp)}
                </time>
              </div>
            </li>
          )}
        </For>
      </ol>
    </Show>
  );
}
