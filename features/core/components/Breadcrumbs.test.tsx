import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('o último item é aria-current e não vira link', () => {
    const { getByText, queryByRole } = render(() => (
      <Breadcrumbs
        items={[{ label: 'Contêineres', href: '/painel/conteineres' }, { label: 'MSKU-4410' }]}
      />
    ));
    expect(getByText('MSKU-4410')).toHaveAttribute('aria-current', 'page');
    expect(queryByRole('link', { name: 'MSKU-4410' })).toBeNull();
    expect(queryByRole('link', { name: 'Contêineres' })).toHaveAttribute(
      'href',
      '/painel/conteineres',
    );
  });
});
