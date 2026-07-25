import { UserEditScreen } from '@view/users/screens/UserEditScreen';
import { createUserEditVM } from '@viewmodel/users/user-edit-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createUserEditVM({
    url: pageContext.urlOriginal,
    routeParams: pageContext.routeParams,
  });
  return (
    <ClientOnly fallback={<div />}>
      <UserEditScreen vm={vm} />
    </ClientOnly>
  );
}
