import { LoginForm } from '@view/auth/islands/LoginForm.island';
import { Brand } from '@view/core/components/Brand';
import { FormSkeleton } from '@view/core/components/Skeleton';
import type { LoginPageText } from '@viewmodel/auth/i18n/login-page.messages';
import type { JSX } from 'solid-js';
import { ClientOnly } from 'vike-solid/ClientOnly';


import styles from '../styles/LoginPage.module.scss';

/**
 * Tela de login: painel promocional (SSR) + formulário hidratado no cliente.
 *
 * @param props.t Texto já resolvido para o locale da requisição.
 */
export function LoginPage(props: { t: LoginPageText }): JSX.Element {
  return (
    <main class={styles.page}>
      <section class={styles.promo} aria-labelledby="promo-title">
        <Brand />
        <h1 id="promo-title" class={styles.headline}>
          {props.t.title}
        </h1>
        <p class={styles.desc}>{props.t.subtitle}</p>
        <p class={styles.script}>{props.t.script}</p>
      </section>

      <section class={styles.formPanel} aria-label={props.t.title}>
        <ClientOnly fallback={<FormSkeleton rows={2} />}>
          <LoginForm t={props.t} />
        </ClientOnly>
        <p class={styles.hint}>
          Demo: <code>ana@portmaster.test</code> / <code>admin123</code>
        </p>
      </section>
    </main>
  );
}
