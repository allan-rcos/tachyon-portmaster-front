import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';

import { ThemeSwitcher } from './ThemeSwitcher.island';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.cookie = 'flow-theme=; max-age=0; path=/';
  });

  it('aplica o tema claro no <html> e grava cookie', async () => {
    const user = userEvent.setup();
    const { getByLabelText } = render(() => <ThemeSwitcher />);
    await user.click(getByLabelText('Tema claro'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.cookie).toContain('flow-theme=light');
  });
});
