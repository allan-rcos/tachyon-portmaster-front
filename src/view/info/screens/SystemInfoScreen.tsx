import { Badge } from '@view/core/components/Badge';
import { Toolbar } from '@view/core/components/Toolbar';
import type { InfoFact, SystemInfoVM } from '@viewmodel/system/system-info-page.vm';
import { For, Show, type JSX } from 'solid-js';

import styles from './SystemInfoScreen.module.scss';

/** Props do diagnóstico de runtime. */
export interface SystemInfoScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: SystemInfoVM;
}

/** Os pares rótulo/valor de um painel. */
function Facts(props: { items: readonly InfoFact[] }): JSX.Element {
  return (
    <dl class={styles.facts}>
      <For each={props.items}>
        {(fact) => (
          <div class={styles.fact}>
            <dt class={styles.label}>{fact.label}</dt>
            <dd class={styles.value}>{fact.value}</dd>
          </div>
        )}
      </For>
    </dl>
  );
}

/**
 * Tela /info: painéis de vidro com pares rótulo/valor.
 *
 * A `<table>` saiu — não havia dado tabular, só uma lista de fatos, e a tabela
 * trazia junto uma folha de estilo GLOBAL própria (a única do projeto) com
 * nomes de classe que ninguém mais usava. Junto com ela saíram os textos fixos
 * em pt-BR: esta era a última tela que não falava o idioma da requisição.
 *
 * O painel do backend deixou de ser placeholder. Quando a API não responde, o
 * ViewModel entrega `backend` ausente e a tela diz isso — numa tela de
 * diagnóstico, "a API está fora" é o resultado, não a falha.
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
          <Facts items={props.vm.facts} />
        </article>

        <article class={styles.panel}>
          <header class={styles.head}>
            <h2 class={styles.name}>{props.vm.backend?.processName ?? props.vm.t.backend}</h2>
            <Show when={props.vm.backend?.runtime}>
              {(runtime) => <Badge tone="sage">{runtime()}</Badge>}
            </Show>
          </header>
          <Show
            when={props.vm.backend}
            fallback={<p class={styles.pending}>{props.vm.t.backendUnreachable}</p>}
          >
            {(backend) => <Facts items={backend().facts} />}
          </Show>
        </article>
      </div>
    </section>
  );
}
