import { getByRole, getByText } from '@testing-library/dom';
import { html, render } from 'lit';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
  it('renderiza título e conteúdo com estrutura semântica', () => {
    const el = document.createElement('div');
    document.body.append(el);
    render(Card({ title: 'Ocupação', children: html`<p>corpo</p>` }), el);

    expect(getByRole(el, 'heading', { name: 'Ocupação' })).toBeInTheDocument();
    expect(getByText(el, 'corpo')).toBeInTheDocument();
  });

  it('a tag e o nível do heading vêm das props', () => {
    const el = document.createElement('div');
    document.body.append(el);
    render(
      Card({ as: 'section', headingLevel: 'h3', title: 'Risco', children: html`<p>corpo</p>` }),
      el,
    );

    expect(el.querySelector('section')).not.toBeNull();
    expect(getByRole(el, 'heading', { name: 'Risco', level: 3 })).toBeInTheDocument();
  });
});
