import { UserListScreen } from '@view/users/screens/UserListScreen';
import { createUserListVM } from '@viewmodel/users/user-list-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createUserListVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <UserListScreen vm={vm} />
    </ClientOnly>
  );
}
