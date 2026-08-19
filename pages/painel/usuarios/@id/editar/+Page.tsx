import { UserEditScreen } from '@view/users/screens/UserEditScreen';
import { createUserEditVM, type UserEditPageInput } from '@viewmodel/users/user-edit-page.vm';
import { createUserListVM } from '@viewmodel/users/user-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<UserEditPageInput>();
  return <UserEditScreen vm={createUserEditVM(input)} list={createUserListVM(input.background)} />;
}
