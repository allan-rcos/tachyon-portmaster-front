import { ClientOnly } from 'vike-solid/ClientOnly';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';
import styles from './ContaPage.module.scss';

import { AccountProfile } from '@/features/account/components/AccountProfile';
import { AccountForm } from '@/features/account/islands/AccountForm.island';
import { PasswordChange } from '@/features/account/islands/PasswordChange.island';
import { Breadcrumbs } from '@/features/core/components/Breadcrumbs';
import { Card } from '@/features/core/components/Card';
import { PageHeader } from '@/features/core/components/PageHeader';
import { FormSkeleton } from '@/features/core/components/Skeleton';

export default function AccountPage() {
  const data = useData<Data>();
  return (
    <section>
      <Breadcrumbs items={[{ label: data.t.title }]} />
      <PageHeader title={data.t.title} subtitle={data.t.subtitle} />
      <div class={styles.grid}>
        <AccountProfile profile={data.profile} t={data.t} />
        <Card title={data.t.profile}>
          <ClientOnly fallback={<FormSkeleton rows={2} />}>
            <AccountForm name={data.profile.name} email={data.profile.email} t={data.t} />
          </ClientOnly>
        </Card>
        <Card title={data.t.security}>
          <ClientOnly fallback={<FormSkeleton rows={2} />}>
            <PasswordChange t={data.t} />
          </ClientOnly>
        </Card>
      </div>
    </section>
  );
}
