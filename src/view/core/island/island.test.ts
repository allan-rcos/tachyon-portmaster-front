// ============================================================
//  O mecanismo que sustenta toda a interatividade da View, exercitado ponta a
//  ponta: SSR → hidratação → mudança de sinal → DOM.
//
//  Três coisas precisam ser verdade ao mesmo tempo, e nenhuma delas é óbvia:
//
//    1. o `@lit-labs/ssr` serializa uma diretiva (chamando só o `render()`
//       dela), então o island entra no HTML com o estado inicial;
//    2. o `hydrate()` do `@lit-labs/ssr-client` reconhece essa diretiva e
//       reassocia as expressões ao DOM que veio do servidor, sem recriá-lo;
//    3. a instância do island é a MESMA entre re-renders — é o que preserva o
//       estado local. Se falhar, todo signal de island volta ao inicial a cada
//       mudança em qualquer lugar da página.
// ============================================================
import { render as renderSsr } from '@lit-labs/ssr/lib/render-lit-html.js';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { hydrate } from '@lit-labs/ssr-client';
import { effect, signal } from 'alien-signals';
import { html, render } from 'lit';
import { describe, expect, it } from 'vitest';

import { Island } from './island';
import { island } from './mount';

interface CounterProps {
  label: string;
}

/** Island de teste: conta cliques e registra quantas instâncias existiram. */
let instances = 0;
let disposed = 0;

class Counter extends Island<CounterProps> {
  #count = signal(0);

  constructor(props: CounterProps) {
    super(props);
    instances += 1;
  }

  increment(): void {
    this.#count(this.#count() + 1);
  }

  override dispose(): void {
    disposed += 1;
  }

  template() {
    return html`<button class="counter" @click=${() => this.increment()}>
      ${this.props.label}: ${this.#count()}
    </button>`;
  }
}

/** A página inteira, como o `+Page` a devolveria: um thunk. */
function page(label: () => string) {
  return () => html`<main>${island(Counter, { label: label() })}</main>`;
}

describe('island', () => {
  it('serializa no SSR com o estado inicial', () => {
    instances = 0;
    const view = page(() => 'Cliques');
    const htmlOut = collectResultSync(renderSsr(view()));

    expect(htmlOut).toContain('Cliques');
    expect(htmlOut).toContain('0');
    expect(htmlOut).toContain('<button');
    // Os marcadores são o que o hydrate() consome.
    expect(htmlOut).toContain('<!--lit-part');
  });

  it('hidrata sobre o HTML do servidor e reage ao clique', async () => {
    instances = 0;
    const view = page(() => 'Cliques');

    // Servidor.
    const container = document.createElement('div');
    container.innerHTML = collectResultSync(renderSsr(view()));
    document.body.append(container);
    const serverButton = container.querySelector('button.counter');
    expect(serverButton).not.toBeNull();

    // Cliente: hidrata e liga o laço de render (o mesmo desenho do vike-lit).
    hydrate(view(), container);
    let first = true;
    effect(() => {
      const tmpl = view();
      if (first) {
        first = false;
        render(tmpl, container);
        return;
      }
      render(tmpl, container);
    });

    // O nó do servidor foi reaproveitado, não recriado — é a prova de que a
    // hidratação casou em vez de reconstruir a árvore.
    expect(container.querySelector('button.counter')).toBe(serverButton);

    const button = container.querySelector('button.counter') as HTMLButtonElement;
    expect(button.textContent).toContain('0');

    button.click();
    expect(button.textContent).toContain('1');
    // Mesmo nó depois do re-render: o diff do lit-html trocou só o texto.
    expect(container.querySelector('button.counter')).toBe(serverButton);
  });

  it('preserva a instância — e o estado — quando as props mudam', () => {
    instances = 0;
    const label = signal('Cliques');
    const view = page(() => label());

    const container = document.createElement('div');
    document.body.append(container);
    render(view(), container);
    expect(instances).toBe(1);

    const button = container.querySelector('button.counter') as HTMLButtonElement;
    button.click();
    render(view(), container);
    expect(button.textContent).toContain('1');

    // Prop nova: o island recebe `setProps`, não um construtor novo.
    label('Toques');
    render(view(), container);

    expect(instances).toBe(1);
    expect(button.textContent).toContain('Toques');
    expect(button.textContent).toContain('1'); // o estado sobreviveu
  });

  it('chama dispose() quando o island sai da árvore', () => {
    instances = 0;
    disposed = 0;
    const visible = signal(true);
    const view = () =>
      html`<main>${visible() ? island(Counter, { label: 'Cliques' }) : null}</main>`;

    const container = document.createElement('div');
    document.body.append(container);
    render(view(), container);
    expect(instances).toBe(1);
    expect(disposed).toBe(0);

    visible(false);
    render(view(), container);

    expect(container.querySelector('button.counter')).toBeNull();
    expect(disposed).toBe(1);
  });
});
