import { createSignal, Show, type JSX } from 'solid-js';

import styles from './ConfirmDialog.island.module.scss';

import { Icon, type IconName } from '@/features/core/components/Icon';
import { cn } from '@/features/core/utils/ui';

export interface ConfirmDialogProps {
  triggerLabel: string;
  triggerIcon?: IconName;
  triggerVariant?: 'primary' | 'secondary' | 'danger';
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant?: 'primary' | 'danger';
  /** Ação assíncrona (browserCall). */
  onConfirm: () => Promise<void>;
  /** Chamado após sucesso (ex.: recarregar via window.location). */
  onDone?: () => void;
}

/** Diálogo de confirmação reutilizável (lacrar/despachar/excluir). */
export function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal(false);

  const run = async () => {
    setPending(true);
    setError(false);
    try {
      await props.onConfirm();
      setOpen(false);
      props.onDone?.();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        class={cn(styles.trigger, styles[props.triggerVariant ?? 'secondary'])}
        onClick={() => setOpen(true)}
      >
        {props.triggerIcon && <Icon name={props.triggerIcon} size={16} />}
        {props.triggerLabel}
      </button>

      <Show when={open()}>
        <div class={styles.scrim} onClick={() => !pending() && setOpen(false)}>
          <div
            class={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={props.title}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 class={styles.title}>{props.title}</h2>
            <p class={styles.message}>{props.message}</p>
            <p class={styles.error} role="alert" hidden={!error()}>
              Não foi possível concluir. Tente novamente.
            </p>
            <menu class={styles.actions}>
              <li>
                <button
                  type="button"
                  class={cn(styles.trigger, styles.secondary)}
                  onClick={() => setOpen(false)}
                  disabled={pending()}
                >
                  {props.cancelLabel}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class={cn(
                    styles.trigger,
                    styles[props.confirmVariant ?? 'primary'],
                    pending() && styles.loading,
                  )}
                  onClick={run}
                  disabled={pending()}
                >
                  {props.confirmLabel}
                </button>
              </li>
            </menu>
          </div>
        </div>
      </Show>
    </>
  );
}
