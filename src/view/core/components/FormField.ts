import type { Renderable } from '@view/core/types';
import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import styles from './FormField.module.scss';

export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  for?: string;
  children: Renderable;
}

/** Campo de formulário: label + controle + erro/hint. */
export function FormField(props: FormFieldProps): TemplateResult {
  return html`<div class=${styles.field}>
    <label class=${styles.label} for=${ifDefined(props.for)}>${props.label}</label>
    ${props.children}
    <p class=${styles.error} role="alert" ?hidden=${!props.error}>${props.error}</p>
    ${props.hint && !props.error ? html`<p class=${styles.hint}>${props.hint}</p>` : nothing}
  </div>`;
}
