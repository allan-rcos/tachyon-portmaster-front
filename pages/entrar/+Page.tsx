import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';
import styles from './LoginPage.module.scss';

import { LoginForm } from '@/features/auth/islands/LoginForm.island';
import { Brand } from '@/shared/components/Brand';
import { FormSkeleton } from '@/shared/components/Skeleton';

export default function LoginPage() {
  const data = useData<Data>();

  return (
    <main class={styles.page}>
      <section class={styles.promo} aria-labelledby="promo-title">
        <Brand />
        <h1 id="promo-title" class={styles.headline}>
          {data.t.title}
        </h1>
        <p class={styles.desc}>{data.t.subtitle}</p>
        <p class={styles.script}>{data.t.script}</p>
      </section>

      <section class={styles.formPanel} aria-label={data.t.title}>
        <ClientOnly fallback={<FormSkeleton rows={2} />}>
          <LoginForm t={data.t} />
        </ClientOnly>
        <p class={styles.hint}>
          Demo: <code>ana@portmaster.test</code> / <code>admin123</code>
        </p>
      </section>
    </main>
  );
}
