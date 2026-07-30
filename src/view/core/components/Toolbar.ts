import { Icon } from '@view/core/components/Icon';
import type { Renderable } from '@view/core/types';
import { html, nothing, type TemplateResult } from 'lit';

import styles from './Toolbar.module.scss';

export interface ToolbarSearch {
  /** Nome do campo na query string. */
  name: string;
  /** Valor corrente, para o campo voltar preenchido depois do GET. */
  value: string;
  placeholder: string;
  /** Rótulo do botão de envio (também é o rótulo acessível do campo). */
  label: string;
  /** Filtros a preservar no envio, como campos ocultos. */
  keep?: Readonly<Record<string, string>>;
}

export interface ToolbarProps {
  /** Linha de contexto em caixa alta (`PÁTIO`, `CONSOLE`, `CONTÊINER`). */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Busca opcional — um `GET` nativo, sem JS. */
  search?: ToolbarSearch;
  /** Ação primária da tela, à direita da busca. */
  action?: Renderable;
}

/**
 * Cabeçalho de página do protótipo: eyebrow + título de um lado, busca e ação
 * do outro, tudo sobre um painel de vidro.
 *
 * A busca é um formulário `GET`: recarregar a rota com a nova query devolve o
 * recorte já renderizado pelo servidor. Os outros filtros ativos viajam como
 * campos ocultos, senão buscar apagaria o filtro de status.
 *
 * O protótipo mostra ainda um chip de região e um sino de notificações; os dois
 * ficaram de fora porque não há dado por trás deles — seriam enfeite que finge
 * ser funcionalidade.
 */
export function Toolbar(props: ToolbarProps): TemplateResult {
  const search = props.search;

  return html`<header class=${styles.bar}>
    <div>
      <span class=${styles.eyebrow}>${props.eyebrow}</span>
      <h1 class=${styles.title}>${props.title}</h1>
      ${props.subtitle ? html`<p class=${styles.subtitle}>${props.subtitle}</p>` : nothing}
    </div>

    ${
      search
        ? html`<form class=${styles.side} method="get" role="search">
            ${Object.entries(search.keep ?? {}).map(
              ([name, value]) => html`<input type="hidden" name=${name} value=${value} />`,
            )}
            <label class=${styles.search}>
              ${Icon({ name: 'search', size: 16 })}
              <span class="srOnly">${search.label}</span>
              <input name=${search.name} value=${search.value} placeholder=${search.placeholder} />
            </label>
            <button type="submit" class=${styles.submit}>${search.label}</button>
          </form>`
        : nothing
    }
    ${props.action ? html`<div class=${styles.side}>${props.action}</div>` : nothing}
  </header>`;
}
