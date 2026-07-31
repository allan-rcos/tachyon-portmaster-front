import { LoginForm } from '@view/auth/islands/LoginForm.island';
import styles from '@view/auth/styles/LoginPage.module.scss';
import { Brand } from '@view/core/components/Brand';
import type { LoginVM } from '@viewmodel/auth/login-page.vm';
import type { JSX } from 'solid-js';

export interface LoginPageProps {
  /** ViewModel da rota. */
  vm: LoginVM;
}

/**
 * Tela de login: painel promocional + formulário, ambos em SSR.
 *
 * O formulário deixou de ficar atrás de um `ClientOnly` com esqueleto. Aquilo
 * existia porque o `@tanstack/solid-form` só montava no navegador; agora o
 * estado vem do ViewModel e o markup é o mesmo nos dois lados, então o HTML da
 * primeira requisição já sai com os campos dentro — e a hidratação só religa os
 * handlers.
 *
 * @param props.vm ViewModel da rota.
 */
export function LoginPage(props: LoginPageProps): JSX.Element {
  return (
    <main class={styles.page}>
      <section class={styles.promo} aria-labelledby="promo-title">
        <Brand />
        <h1 id="promo-title" class={styles.headline}>
          {props.vm.t.title}
        </h1>
        <p class={styles.desc}>{props.vm.t.subtitle}</p>
        <p class={styles.script}>{props.vm.t.script}</p>
      </section>

      <section class={styles.formPanel} aria-label={props.vm.t.title}>
        <LoginForm vm={props.vm} />
        <p class={styles.hint}>
          Demo: <code>ana@portmaster.test</code> / <code>admin123</code>
        </p>
      </section>
    </main>
  );
}
