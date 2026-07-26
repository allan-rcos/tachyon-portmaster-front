import { UserListScreen } from '@view/users/screens/UserListScreen';
import { createUserListVM, type UserListPageInput } from '@viewmodel/users/user-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<UserListPageInput>();
  return <UserListScreen vm={createUserListVM(input)} />;
}
