import { Icon, type IconName } from '@view/core/components/Icon';
import { onCleanup, onMount, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import styles from './RouteModal.island.module.scss';

/** Tinta do azulejo do ícone — segue o domínio, como no protótipo. */
export type ModalTint = 'teal' | 'sage' | 'gold' | 'orange';

export interface RouteModalProps {
  /** Sobrescrita do título (ex.: `Pátio`, `Catálogo`). */
  eyebrow: string;
  title: string;
  /** Ícone do azulejo à esquerda do título. */
  icon: IconName;
  /** Tinta do azulejo. Padrão `teal`. */
  tint?: ModalTint;
  /**
   * Para onde "fechar" leva — a listagem que está por baixo.
   *
   * É um destino, e não um callback, de propósito: o estado de "aberto" é a
   * ROTA, então fechar é navegar. É isso que faz o botão de fechar funcionar
   * como link, sem JS, e o Voltar do navegador se comportar como esperado.
   */
  closeHref: string;
  /** Rótulo acessível do botão de fechar. */
  closeLabel: string;
  children: JSX.Element;
}

/**
 * Modal cuja abertura é a própria rota.
 *
 * O protótipo desenha os formulários como modais sobre a listagem, mas um modal
 * de estado puro perderia três coisas que as rotas já davam: deep-link, SSR do
 * formulário e o guard de permissão por rota (que vive no `createXPageInput`).
 * Aqui a rota continua existindo e a listagem continua sendo renderizada atrás
 * — o modal é só como esta rota se apresenta.
 *
 * Sem JS o formulário ainda aparece e ainda envia: `<a href>` para fechar, e
 * nada depende de hidratação. Com JS, ganha Escape e clique no véu.
 *
 * Vai num `Portal` para o `<body>` por causa do SCROLL SELETIVO: quem rola no
 * shell é a coluna de conteúdo, não o documento. Se o véu continuasse dentro
 * dela, a roda do mouse sobre ele encadearia para o ancestral e a listagem
 * correria por trás do modal. No `<body>` a cadeia acima do véu não tem nada
 * que role. De quebra, o modal deixa de depender do contexto de empilhamento
 * de quem o renderizou.
 */
export function RouteModal(props: RouteModalProps): JSX.Element {
  let dialog: HTMLDivElement | undefined;

  const leave = () => {
    window.location.href = props.closeHref;
  };

  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') leave();
    };
    document.addEventListener('keydown', onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // O foco entra no diálogo; sem isto o teclado continuaria na listagem.
    dialog?.focus();

    onCleanup(() => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    });
  });

  return (
    <Portal>
      <div class={styles.scrim} onClick={leave}>
        <div
          ref={dialog}
          class={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="route-modal-title"
          tabindex="-1"
          onClick={(event) => event.stopPropagation()}
        >
          <header class={styles.head}>
            <div class={styles.heading}>
              <span class={`${styles.tile} ${styles[props.tint ?? 'teal']}`} aria-hidden="true">
                <Icon name={props.icon} size={21} />
              </span>
              <div>
                <p class={styles.eyebrow}>{props.eyebrow}</p>
                <h2 id="route-modal-title" class={styles.title}>
                  {props.title}
                </h2>
              </div>
            </div>
            <a class={styles.close} href={props.closeHref} aria-label={props.closeLabel}>
              <Icon name="x" size={16} />
            </a>
          </header>

          <div class={styles.body}>{props.children}</div>
        </div>
      </div>
    </Portal>
  );
}
