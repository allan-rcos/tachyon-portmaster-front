import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import type { ContainerDetailText } from '@viewmodel/containers/i18n/text-contracts';
import { deleteContainer } from '@viewmodel/containers/mutations/delete-container.mutation';
import { dispatchContainer } from '@viewmodel/containers/mutations/dispatch-container.mutation';
import { sealContainer } from '@viewmodel/containers/mutations/seal-container.mutation';
import type { ContainerStatus } from '@viewmodel/core/domain';
import { Show, type JSX } from 'solid-js';

import styles from './ContainerActions.island.module.scss';


/** Ações de estado do contêiner: lacrar / despachar / excluir.
 *  Cada uma confirma antes e recarrega (novo SSR) ao concluir. */
export function ContainerActions(props: {
  containerId: string;
  status: ContainerStatus;
  t: ContainerDetailText;
}): JSX.Element {
  const canSeal = () => props.status === 'Empty' || props.status === 'Loading';
  const canDispatch = () => props.status === 'Sealed';

  return (
    <menu class={styles.actions}>
      <Show when={canSeal()}>
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

      <Show when={canDispatch()}>
        <li>
          <ConfirmDialog
            triggerLabel={props.t.dispatch}
            triggerIcon="ship"
            triggerVariant="primary"
            title={props.t.dispatch}
            message={props.t.dispatchConfirm}
            confirmLabel={props.t.dispatch}
            cancelLabel={props.t.cancel}
            onConfirm={() =>
              dispatchContainer(props.containerId)
            }
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
