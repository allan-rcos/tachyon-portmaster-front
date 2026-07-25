import { RoleListScreen } from '@view/roles/screens/RoleListScreen';
import { createRoleListVM } from '@viewmodel/roles/role-list-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createRoleListVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <RoleListScreen vm={vm} />
    </ClientOnly>
  );
}
