import { Icon, type IconName } from '@view/core/components/Icon';
import type { ManifestPageText } from '@viewmodel/manifests/i18n/text-contracts';
import { For, type JSX } from 'solid-js';

import styles from './MovementRules.module.scss';

export interface MovementRulesProps {
  t: ManifestPageText;
}

/**
 * Cartão lateral com as regras de movimentação.
 *
 * É texto estático — nada aqui reage —, então é componente e não island: sai
 * inteiro no HTML da primeira requisição e não custa JS no cliente.
 *
 * As quatro regras não são decorativas: elas explicam por que uma carga pode
 * ser recusada pelo backend (classe de risco, limite de peso, status do
 * contêiner), que é a dúvida que a tela gera.
 *
 * @param props.t Texto da tela, já resolvido no locale.
 */
export function MovementRules(props: MovementRulesProps): JSX.Element {
  const rules = (): readonly { icon: IconName; text: string }[] => [
    { icon: 'flask', text: props.t.ruleRisk },
    { icon: 'weight', text: props.t.ruleWeight },
    { icon: 'lock', text: props.t.ruleSealed },
    { icon: 'rotate', text: props.t.ruleEmpty },
  ];

  return (
    <aside class={styles.card}>
      <h2 class={styles.title}>{props.t.rules}</h2>
      <ul class={styles.list}>
        <For each={rules()}>
          {(rule) => (
            <li class={styles.item}>
              <Icon name={rule.icon} size={17} />
              <span>{rule.text}</span>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
}
