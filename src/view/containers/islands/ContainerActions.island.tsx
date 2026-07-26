import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import type { ContainerDetailText } from '@viewmodel/containers/i18n/text-contracts';
import { deleteContainer } from '@viewmodel/containers/mutations/delete-container.mutation';
import { dispatchContainer } from '@viewmodel/containers/mutations/dispatch-container.mutation';
import { sealContainer } from '@viewmodel/containers/mutations/seal-container.mutation';
import { Show, type JSX } from 'solid-js';

import styles from './ContainerActions.island.module.scss';

export interface ContainerActionsProps {
  containerId: string;
  /** Se lacrar é permitido — decidido pelo ViewModel, que conhece o status. */
  canSeal: boolean;
  /** Se despachar é permitido. */
  canDispatch: boolean;
  t: ContainerDetailText;
}

/** Ações de estado do contêiner: lacrar / despachar / excluir.
 *  Cada uma confirma antes e recarrega (novo SSR) ao concluir. */
export function ContainerActions(props: ContainerActionsProps): JSX.Element {
  return (
    <menu class={styles.actions}>
      <Show when={props.canSeal}>
        <li>
          <ConfirmDialog
            triggerLabel={props.t.seal}
            triggerIcon="lock"
            triggerVariant="secondary"
            title={props.t.seal}
            message={props.t.sealConfirm}
            confirmLabel={props.t.seal}
            cancelLabel={props.t.cancel}
            onConfirm={() => sealContainer(props.containerId)}
            onDone={() => window.location.reload()}
          />
        </li>
      </Show>

      <Show when={props.canDispatch}>
        <li>
          <ConfirmDialog
            triggerLabel={props.t.dispatch}
            triggerIcon="ship"
            triggerVariant="primary"
            title={props.t.dispatch}
            message={props.t.dispatchConfirm}
            confirmLabel={props.t.dispatch}
            cancelLabel={props.t.cancel}
            onConfirm={() => dispatchContainer(props.containerId)}
            onDone={() => window.location.reload()}
          />
        </li>
      </Show>

      <li>
        <ConfirmDialog
          triggerLabel={props.t.delete}
          triggerIcon="trash"
          triggerVariant="danger"
          confirmVariant="danger"
          title={props.t.delete}
          message={props.t.deleteConfirm}
          confirmLabel={props.t.delete}
          cancelLabel={props.t.cancel}
          onConfirm={() => deleteContainer(props.containerId)}
          onDone={() => {
            window.location.href = '/painel/conteineres';
          }}
        />
      </li>
    </menu>
  );
}
