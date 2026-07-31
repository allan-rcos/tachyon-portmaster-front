import { Badge } from '@view/core/components/Badge';
import { Toolbar } from '@view/core/components/Toolbar';
import type { InfoFact, SystemInfoVM } from '@viewmodel/system/system-info-page.vm';
import { html, type TemplateResult } from 'lit';

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
/** Os pares rótulo/valor de um painel. */
function facts(items: readonly InfoFact[]): TemplateResult {
  return html`<dl class=${styles.facts}>
    ${items.map(
      (fact) =>
        html`<div class=${styles.fact}>
          <dt class=${styles.label}>${fact.label}</dt>
          <dd class=${styles.value}>${fact.value}</dd>
        </div>`,
    )}
  </dl>`;
}

export function SystemInfoScreen(props: SystemInfoScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Toolbar({ eyebrow: vm.t.eyebrow, title: vm.t.title, subtitle: vm.t.subtitle })}

    <div class=${styles.grid}>
      <article class=${styles.panel}>
        <header class=${styles.head}>
          <h2 class=${styles.name}>${vm.processName}</h2>
          ${Badge({ tone: 'teal', children: vm.runtime })}
        </header>
        ${facts(vm.facts)}
      </article>

      <article class=${styles.panel}>
        <header class=${styles.head}>
          <h2 class=${styles.name}>${vm.backend?.processName ?? vm.t.backend}</h2>
          ${vm.backend?.runtime ? Badge({ tone: 'sage', children: vm.backend.runtime }) : null}
        </header>
        ${
          vm.backend
            ? facts(vm.backend.facts)
            : html`<p class=${styles.pending}>${vm.t.backendUnreachable}</p>`
        }
      </article>
    </div>
  </section>`;
}
