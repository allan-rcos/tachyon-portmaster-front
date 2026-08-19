import { Icon } from '@view/core/components/Icon';
import type { ShellLocaleOption } from '@viewmodel/core/page/shell';
import { For, type JSX } from 'solid-js';

import styles from './LocaleSwitcher.module.scss';

export interface LocaleSwitcherProps {
  /** Opções já montadas: mesmo endereço nos outros idiomas. */
  options: readonly ShellLocaleOption[];
}

/**
 * Seletor de idioma.
 *
 * São links, não botões: o idioma é o começo da URL, então trocá-lo é navegar.
 * Isso faz o seletor funcionar sem JS, dá endereço próprio a cada idioma
 * (compartilhável e indexável) e dispensa estado no cliente.
 *
 * Não calcula caminho — recebe pronto, como o resto do chrome.
 */
export function LocaleSwitcher(props: LocaleSwitcherProps): JSX.Element {
  return (
    <nav class={styles.group} aria-label="Idioma">
      <Icon name="globe" size={15} />
      <ul class={styles.list}>
        <For each={props.options}>
          {(option) => (
            <li>
              <a
                class={styles.item}
                classList={{ [styles.active]: option.active }}
                href={option.href}
                lang={option.tag}
                hreflang={option.tag}
                aria-current={option.active ? 'true' : undefined}
                title={option.label}
              >
                <span aria-hidden="true">{option.short}</span>
                <span class="srOnly">{option.label}</span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
