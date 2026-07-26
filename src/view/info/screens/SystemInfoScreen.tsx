import { Badge } from '@view/core/components/Badge';
import { Toolbar } from '@view/core/components/Toolbar';
import type { SystemInfoVM } from '@viewmodel/system/system-info-page.vm';
import { For, type JSX } from 'solid-js';

import styles from './SystemInfoScreen.module.scss';

/** Props do diagnóstico de runtime. */
export interface SystemInfoScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: SystemInfoVM;
}

/**
 * Tela /info: painéis de vidro com pares rótulo/valor.
 *
 * A `<table>` saiu — não havia dado tabular, só uma lista de fatos, e a tabela
 * trazia junto uma folha de estilo GLOBAL própria (a única do projeto) com
 * nomes de classe que ninguém mais usava. Junto com ela saíram os textos fixos
 * em pt-BR: esta era a última tela que não falava o idioma da requisição.
 *
 * @param props.vm ViewModel da rota.
 */
export function SystemInfoScreen(props: SystemInfoScreenProps): JSX.Element {
  return (
    <section>
      <Toolbar
        eyebrow={props.vm.t.eyebrow}
        title={props.vm.t.title}
        subtitle={props.vm.t.subtitle}
      />

      <div class={styles.grid}>
        <article class={styles.panel}>
          <header class={styles.head}>
            <h2 class={styles.name}>{props.vm.processName}</h2>
            <Badge tone="teal">{props.vm.runtime}</Badge>
          </header>
          <dl class={styles.facts}>
            <For each={props.vm.facts}>
              {(fact) => (
                <div class={styles.fact}>
                  <dt class={styles.label}>{fact.label}</dt>
                  <dd class={styles.value}>{fact.value}</dd>
                </div>
              )}
            </For>
          </dl>
        </article>

        <article class={styles.panel}>
          <header class={styles.head}>
            <h2 class={styles.name}>{props.vm.t.backend}</h2>
          </header>
          <p class={styles.pending}>{props.vm.t.backendPending}</p>
        </article>
      </div>
    </section>
  );
}
