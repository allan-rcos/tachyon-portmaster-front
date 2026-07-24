import { createSignal, type JSX } from 'solid-js';

import styles from './ThemeSwitcher.island.module.scss';

import { Icon } from '@/features/core/components/Icon';
import { getCookie, setCookie } from '@/features/core/utils/cookies';
import { cn } from '@/features/core/utils/ui';

type Theme = 'light' | 'dark';

/** Alterna tema claro/escuro; grava cookie `flow-theme` e o atributo
 *  `data-theme` no <html>. Lido server-side pelo txiki (anti-FOUC). */
export function ThemeSwitcher(): JSX.Element {
  const initial = (): Theme => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return (getCookie('flow-theme') as Theme) || 'dark';
  };
  const [theme, setTheme] = createSignal<Theme>(initial());

  const apply = (t: Theme) => {
    setTheme(t);
    setCookie('flow-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  return (
    <div class={styles.group} role="group" aria-label="Tema">
      <button
        type="button"
        class={cn(styles.btn, theme() === 'light' && styles.active)}
        onClick={() => apply('light')}
        aria-pressed={theme() === 'light'}
        aria-label="Tema claro"
      >
        <Icon name="sun" size={16} />
      </button>
      <button
        type="button"
        class={cn(styles.btn, theme() === 'dark' && styles.active)}
        onClick={() => apply('dark')}
        aria-pressed={theme() === 'dark'}
        aria-label="Tema escuro"
      >
        <Icon name="moon" size={16} />
      </button>
    </div>
  );
}
