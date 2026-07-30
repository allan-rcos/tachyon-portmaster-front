import { island } from '@view/core/island/mount';
import { ConfirmDialog } from '@view/core/islands/ConfirmDialog.island';
import type { ContainerDetailText } from '@viewmodel/containers/i18n/text-contracts';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './ContainerActions.island.module.scss';

/** O que as ações precisam do ViewModel da rota. */
export interface ContainerActionsVM {
  t: ContainerDetailText;
  /** Volta para a listagem, depois de excluir. */
  listHref: string;
  facts: {
    /** Se lacrar é permitido — decidido pelo ViewModel, que conhece o status. */
    canSeal: boolean;
    /** Se despachar é permitido. */
    canDispatch: boolean;
  };
  seal: () => Promise<void>;
  dispatch: () => Promise<void>;
  remove: () => Promise<void>;
}

export interface ContainerActionsProps {
  /** ViewModel da rota. */
  vm: ContainerActionsVM;
}

/**
 * Ações de estado do contêiner: lacrar / despachar / excluir. Cada uma confirma
 * antes e recarrega (novo SSR) ao concluir.
 *
 * Deixou de ser island: não guarda estado nenhum, e as três mutations que ela
 * chamava direto passaram para o ViewModel da rota (`vm.seal`/`dispatch`/
 * `remove`). O estado interativo que resta é o de cada `ConfirmDialog`, que é
 * island por conta própria. O nome do arquivo fica por causa do `.module.scss`
 * ao lado; o que ele desenha continua sendo esta barra de ações.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerActions(props: ContainerActionsProps): TemplateResult {
  const { vm } = props;
  const reload = () => window.location.reload();

  return html`<menu class=${styles.actions}>
    ${
      vm.facts.canSeal
        ? html`<li>
            ${island(ConfirmDialog, {
            triggerLabel: vm.t.seal,
            triggerIcon: 'lock',
            triggerVariant: 'secondary',
            title: vm.t.seal,
            message: vm.t.sealConfirm,
            confirmLabel: vm.t.seal,
            cancelLabel: vm.t.cancel,
            onConfirm: vm.seal,
            onDone: reload,
          })}
          </li>`
        : nothing
    }
    ${
      vm.facts.canDispatch
        ? html`<li>
            ${island(ConfirmDialog, {
            triggerLabel: vm.t.dispatch,
            triggerIcon: 'ship',
            triggerVariant: 'primary',
            title: vm.t.dispatch,
            message: vm.t.dispatchConfirm,
            confirmLabel: vm.t.dispatch,
            cancelLabel: vm.t.cancel,
            onConfirm: vm.dispatch,
            onDone: reload,
          })}
          </li>`
        : nothing
    }
    <li>
      ${island(ConfirmDialog, {
        triggerLabel: vm.t.delete,
        triggerIcon: 'trash',
        triggerVariant: 'danger',
        confirmVariant: 'danger',
        title: vm.t.delete,
        message: vm.t.deleteConfirm,
        confirmLabel: vm.t.delete,
        cancelLabel: vm.t.cancel,
        onConfirm: vm.remove,
        onDone: () => {
          window.location.href = vm.listHref;
        },
      })}
    </li>
  </menu>`;
}
