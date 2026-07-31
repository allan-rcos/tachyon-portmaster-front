import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import type { ContainerActionsVM } from '@viewmodel/containers/vm-contracts';
import { Show, type JSX } from 'solid-js';

import styles from './ContainerActions.island.module.scss';

export interface ContainerActionsProps {
  /** ViewModel da rota. */
  vm: ContainerActionsVM;
}

/**
 * Ações de estado do contêiner: lacrar / despachar / excluir. Cada uma confirma
 * antes e recarrega (novo SSR) ao concluir.
 *
 * Deixou de guardar qualquer coisa: as três mutations que ela chamava direto
 * passaram para o ViewModel da rota (`vm.seal`/`dispatch`/`remove`). O estado
 * interativo que resta é o de cada `ConfirmDialog`, que é island por conta
 * própria. O nome do arquivo fica por causa do `.module.scss` ao lado; o que ele
 * desenha continua sendo esta barra de ações.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerActions(props: ContainerActionsProps): JSX.Element {
  const reload = () => window.location.reload();

  return (
    <menu class={styles.actions}>
      <Show when={props.vm.facts.canSeal}>
        <li>
          <ConfirmDialog
            triggerLabel={props.vm.t.seal}
            triggerIcon="lock"
            triggerVariant="secondary"
            title={props.vm.t.seal}
            message={props.vm.t.sealConfirm}
            confirmLabel={props.vm.t.seal}
            cancelLabel={props.vm.t.cancel}
            onConfirm={props.vm.seal}
            onDone={reload}
          />
        </li>
      </Show>

      <Show when={props.vm.facts.canDispatch}>
        <li>
          <ConfirmDialog
            triggerLabel={props.vm.t.dispatch}
            triggerIcon="ship"
            triggerVariant="primary"
            title={props.vm.t.dispatch}
            message={props.vm.t.dispatchConfirm}
            confirmLabel={props.vm.t.dispatch}
            cancelLabel={props.vm.t.cancel}
            onConfirm={props.vm.dispatch}
            onDone={reload}
          />
        </li>
      </Show>

      <li>
        <ConfirmDialog
          triggerLabel={props.vm.t.delete}
          triggerIcon="trash"
          triggerVariant="danger"
          confirmVariant="danger"
          title={props.vm.t.delete}
          message={props.vm.t.deleteConfirm}
          confirmLabel={props.vm.t.delete}
          cancelLabel={props.vm.t.cancel}
          onConfirm={props.vm.remove}
          onDone={() => {
            window.location.href = props.vm.listHref;
          }}
        />
      </li>
    </menu>
  );
}
