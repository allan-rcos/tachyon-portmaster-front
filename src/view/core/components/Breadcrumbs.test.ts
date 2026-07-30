import { getByText, queryByRole } from '@testing-library/dom';
import { render } from 'lit';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('o último item é aria-current e não vira link', () => {
    const el = document.createElement('div');
    document.body.append(el);
    render(
      Breadcrumbs({
        items: [{ label: 'Contêineres', href: '/painel/conteineres' }, { label: 'MSKU-4410' }],
      }),
      el,
    );

    expect(getByText(el, 'MSKU-4410')).toHaveAttribute('aria-current', 'page');
    expect(queryByRole(el, 'link', { name: 'MSKU-4410' })).toBeNull();
    expect(queryByRole(el, 'link', { name: 'Contêineres' })).toHaveAttribute(
      'href',
      '/painel/conteineres',
    );
  });
});
