import { RoleCreateScreen } from '@view/roles/screens/RoleCreateScreen';
import { createRoleCreateVM } from '@viewmodel/roles/role-create-page.vm';
import { ClientOnly } from 'vike-solid/ClientOnly';
import { usePageContext } from 'vike-solid/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const vm = createRoleCreateVM({ url: pageContext.urlOriginal });
  return (
    <ClientOnly fallback={<div />}>
      <RoleCreateScreen vm={vm} />
    </ClientOnly>
  );
}
