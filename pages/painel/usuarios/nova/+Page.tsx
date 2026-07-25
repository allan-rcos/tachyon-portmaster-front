import { UserCreateScreen } from '@view/users/screens/UserCreateScreen';
import { createUserCreateVM } from '@viewmodel/users/user-create-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createUserCreateVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <UserCreateScreen vm={vm} />
    </ClientOnly>
  );
}
