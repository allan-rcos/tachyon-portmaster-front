import { For, Show, type JSX } from 'solid-js';

import styles from './TelemetryLog.module.scss';

import type { TelemetryEvent } from '@/services/gen/flow/v1/common';
import type { TelemetryLogItem } from '@/services/gen/flow/v1/container';
import { Badge } from '@/shared/components/Badge';
import type { Tone } from '@/shared/i18n/labels';
import { TELEMETRY_EVENT_LABEL } from '@/shared/i18n/labels';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { formatDateTime } from '@/shared/utils/formatters';

const EVENT_TONE: Record<TelemetryEvent, Tone> = {
  Create: 'neutral',
  Load: 'gold',
  Unload: 'orange',
  Seal: 'sage',
  Dispatch: 'teal',
};

/** Linha do tempo de telemetria (SSR). */
export function TelemetryLog(props: { logs: TelemetryLogItem[]; t: Messages }): JSX.Element {
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
