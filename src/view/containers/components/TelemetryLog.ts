import { Badge } from '@view/core/components/Badge';
import type { TelemetryRowData } from '@viewmodel/containers/container-detail-page.vm';
import type { ContainerDetailPageText } from '@viewmodel/containers/i18n/container-detail-page.messages';
import { html, type TemplateResult } from 'lit';

import styles from './TelemetryLog.module.scss';

/** Props da linha do tempo de telemetria. */
export interface TelemetryLogProps {
  /** Eventos já formatados pelo ViewModel. */
  logs: readonly TelemetryRowData[];
  /** Texto do cluster de detalhe. */
  t: ContainerDetailPageText;
}

/**
 * Linha do tempo de telemetria (SSR). Rótulo, tom e data já chegam resolvidos —
 * o mapa de tom por evento mora em `@viewmodel/core/i18n/labels`, junto do
 * resto do vocabulário de apresentação.
 *
 * @param props.logs Eventos a exibir.
 * @param props.t    Texto do cluster de detalhe.
 */
export function TelemetryLog(props: TelemetryLogProps): TemplateResult {
  if (props.logs.length === 0) {
    return html`<p class=${styles.empty}>${props.t.empty}</p>`;
  }

  return html`<ol class=${styles.list}>
    ${props.logs.map(
      (log) =>
        html`<li class=${styles.item}>
          ${Badge({ tone: log.event.tone, children: log.event.label })}
          <div class=${styles.body}>
            <p class=${styles.desc}>${log.description}</p>
            <time class=${styles.time} datetime=${log.timestamp}>${log.formattedTimestamp}</time>
          </div>
        </li>`,
    )}
  </ol>`;
}
