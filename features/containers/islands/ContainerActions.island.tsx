import { Show, type JSX } from 'solid-js';
import type { ContainerStatus } from 'tachyon-portmaster-sdk/common';
import {
  sealContainer,
  dispatchContainer,
  deleteContainer,
} from 'tachyon-portmaster-sdk/containers';

import styles from './ContainerActions.island.module.scss';
import type { ContainerDetailText } from '../components/ContainerSummary';

import { browserClient } from '@/features/core/api/client';
import { ConfirmDialog } from '@/features/core/islands/ConfirmDialog.island';

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
            onConfirm={() => sealContainer(browserClient, props.containerId).then(() => undefined)}
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
              dispatchContainer(browserClient, props.containerId).then(() => undefined)
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
          onConfirm={() => deleteContainer(browserClient, props.containerId).then(() => undefined)}
          onDone={() => {
            window.location.href = '/painel/conteineres';
          }}
        />
      </li>
    </menu>
  );
}
