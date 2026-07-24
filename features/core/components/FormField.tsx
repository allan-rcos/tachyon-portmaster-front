import type { JSX } from 'solid-js';

import styles from './FormField.module.scss';

export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  for?: string;
  children: JSX.Element;
}

/** Campo de formulário: label + controle + erro/hint. */
export function FormField(props: FormFieldProps): JSX.Element {
  return (
    <div class={styles.field}>
      <label class={styles.label} for={props.for}>
        {props.label}
      </label>
      {props.children}
      <p class={styles.error} role="alert" hidden={!props.error}>
        {props.error}
      </p>
      {props.hint && !props.error && <p class={styles.hint}>{props.hint}</p>}
    </div>
  );
}
