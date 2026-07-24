import { createSignal, onCleanup, type JSX } from 'solid-js';

import styles from './SidebarDrawer.island.module.scss';

import { Icon } from '@/features/core/components/Icon';

/** Botão hambúrguer (mobile) que abre/fecha o drawer da sidebar via
 *  `html[data-drawer]`. O AppShell reage a esse atributo no CSS. */
export function SidebarDrawer(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  const set = (v: boolean) => {
    setOpen(v);
    document.documentElement.setAttribute('data-drawer', v ? 'open' : '');
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') set(false);
  };
  document.addEventListener('keydown', onKey);
  onCleanup(() => document.removeEventListener('keydown', onKey));

  return (
    <>
      <button
        type="button"
        class={styles.burger}
        onClick={() => set(!open())}
        aria-label="Menu"
        aria-expanded={open()}
      >
        <Icon name={open() ? 'x' : 'menu'} size={20} />
      </button>
      <div class={styles.overlay} hidden={!open()} onClick={() => set(false)} aria-hidden="true" />
    </>
  );
}
