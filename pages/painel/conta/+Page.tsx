import { AccountScreen } from '@view/account/screens/AccountScreen';
import { createAccountPageVM } from '@viewmodel/account/account-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createAccountPageVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <AccountScreen vm={vm} />
    </ClientOnly>
  );
}
