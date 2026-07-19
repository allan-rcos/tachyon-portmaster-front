import type { JSX } from 'solid-js';

import { Badge } from './Badge';

import type { RiskClass } from '@/services/gen/flow/v1/common';
import { RISK_CLASS_LABEL, RISK_CLASS_TONE } from '@/shared/i18n/labels';

/** Selo de classe de risco de produto. */
export function RiskBadge(props: { riskClass: RiskClass }): JSX.Element {
  return <Badge tone={RISK_CLASS_TONE[props.riskClass]}>{RISK_CLASS_LABEL[props.riskClass]}</Badge>;
}
