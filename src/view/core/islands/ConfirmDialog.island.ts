import { Icon, type IconName } from '@view/core/components/Icon';
import { Island } from '@view/core/island/island';
import type { Renderable } from '@view/core/types';
import { signal } from 'alien-signals';
import { html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import styles from './ConfirmDialog.island.module.scss';

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

/**
 * Diálogo de confirmação reutilizável (lacrar/despachar/excluir).
 *
 * É island porque `open`/`pending`/`error` são estado de interface que precisa
 * sobreviver aos re-renders da página. Do servidor sai só o gatilho — o diálogo
 * em si nasce fechado, então não há nada a hidratar dentro dele.
 */
export class ConfirmDialog extends Island<ConfirmDialogProps> {
  #open = signal(false);
  #pending = signal(false);
  #error = signal(false);

  #run = async (): Promise<void> => {
    this.#pending(true);
    this.#error(false);
    try {
      await this.props.onConfirm();
      this.#open(false);
      this.props.onDone?.();
    } catch {
      this.#error(true);
    } finally {
      this.#pending(false);
    }
  };

  template(): Renderable {
    const props = this.props;
    const pending = this.#pending();

    return html`<button
        type="button"
        class=${classMap({
          [styles.trigger]: true,
          [styles[props.triggerVariant ?? 'secondary']]: true,
        })}
        @click=${() => this.#open(true)}
      >
        ${props.triggerIcon ? Icon({ name: props.triggerIcon, size: 16 }) : nothing}
        ${props.triggerLabel}
      </button>

      ${
        this.#open()
          ? html`<div class=${styles.scrim} @click=${() => !pending && this.#open(false)}>
              <div
                class=${styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-label=${props.title}
                @click=${(e: Event) => e.stopPropagation()}
              >
                <h2 class=${styles.title}>${props.title}</h2>
                <p class=${styles.message}>${props.message}</p>
                <p class=${styles.error} role="alert" ?hidden=${!this.#error()}>
                  Não foi possível concluir. Tente novamente.
                </p>
                <menu class=${styles.actions}>
                  <li>
                    <button
                      type="button"
                      class=${classMap({ [styles.trigger]: true, [styles.secondary]: true })}
                      @click=${() => this.#open(false)}
                      ?disabled=${pending}
                    >
                      ${props.cancelLabel}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      class=${classMap({
                        [styles.trigger]: true,
                        [styles[props.confirmVariant ?? 'primary']]: true,
                        [styles.loading]: pending,
                      })}
                      @click=${this.#run}
                      ?disabled=${pending}
                    >
                      ${props.confirmLabel}
                    </button>
                  </li>
                </menu>
              </div>
            </div>`
          : nothing
      }`;
  }
}
