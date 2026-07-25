import type { RiskClass } from '@viewmodel/core/domain';
import { RISK_CLASS_LABEL, RISK_CLASS_TONE } from '@viewmodel/core/i18n/labels';
import type { JSX } from 'solid-js';

import { Badge } from './Badge';


/** Selo de classe de risco de produto. */
export function RiskBadge(props: { riskClass: RiskClass }): JSX.Element {
  return <Badge tone={RISK_CLASS_TONE[props.riskClass]}>{RISK_CLASS_LABEL[props.riskClass]}</Badge>;
}
