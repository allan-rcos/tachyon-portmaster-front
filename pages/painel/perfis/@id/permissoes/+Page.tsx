import { RolePermissionsScreen } from '@view/roles/screens/RolePermissionsScreen';
import { createRolePermissionsVM } from '@viewmodel/roles/role-permissions-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createRolePermissionsVM({
    url: pageContext.urlOriginal,
    routeParams: pageContext.routeParams,
  });
  return (
    <ClientOnly fallback={<div />}>
      <RolePermissionsScreen vm={vm} />
    </ClientOnly>
  );
}
