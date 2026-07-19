import { Show, type JSX } from 'solid-js';

import styles from './ContainerActions.island.module.scss';

import { browserCall } from '@/services/clients/browser';
import {
  sealContainer,
  dispatchContainer,
  deleteContainer,
} from '@/services/codecs/flow/v1/container';
import type { ContainerStatus } from '@/services/gen/flow/v1/common';
import type { Messages } from '@/shared/i18n/messages/pt-BR';
import { ConfirmDialog } from '@/shared/islands/ConfirmDialog.island';

/** Ações de estado do contêiner: lacrar / despachar / excluir.
 *  Cada uma confirma antes e recarrega (novo SSR) ao concluir. */
export function ContainerActions(props: {
  containerId: string;
  status: ContainerStatus;
  t: Messages;
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
            onConfirm={() =>
              browserCall(sealContainer, { params: { id: props.containerId } }).then(
                () => undefined,
              )
            }
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
              browserCall(dispatchContainer, { params: { id: props.containerId } }).then(
                () => undefined,
              )
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
          onConfirm={() =>
            browserCall(deleteContainer, { params: { id: props.containerId } }).then(
              () => undefined,
            )
          }
          onDone={() => {
            window.location.href = '/painel/conteineres';
          }}
        />
      </li>
    </menu>
  );
}
