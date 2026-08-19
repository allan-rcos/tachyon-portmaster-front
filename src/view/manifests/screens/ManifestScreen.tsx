import { Card } from '@view/core/components/Card';
import { Toolbar } from '@view/core/components/Toolbar';
import { MovementRules } from '@view/manifests/components/MovementRules';
import { ManifestForm } from '@view/manifests/islands/ManifestForm.island';
import type { ManifestVM } from '@viewmodel/manifests/manifest-page.vm';
import type { JSX } from 'solid-js';

import styles from './ManifestScreen.module.scss';

/** Props da tela de movimentação de carga. */
export interface ManifestScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ManifestVM;
}

/**
 * Tela de movimentação de carga — o formulário à esquerda, as regras à direita.
 *
 * Duas colunas no desktop (`1fr 360px`, medido do protótipo) que viram uma só
 * no mobile, com as regras DEPOIS do formulário: quem está no celular veio
 * movimentar carga, não ler regra.
 *
 * @param props.vm ViewModel da rota.
 */
export function ManifestScreen(props: ManifestScreenProps): JSX.Element {
  return (
    <section>
      <Toolbar
        eyebrow={props.vm.t.eyebrow}
        title={props.vm.t.title}
        subtitle={props.vm.t.subtitle}
      />
      <div class={styles.grid}>
        <Card title={props.vm.t.move}>
          <ManifestForm vm={props.vm} />
        </Card>
        <MovementRules t={props.vm.t} />
      </div>
    </section>
  );
}
