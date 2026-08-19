import { UserCreateScreen } from '@view/users/screens/UserCreateScreen';
import { createUserCreateVM, type UserCreatePageInput } from '@viewmodel/users/user-create-page.vm';
import { createUserListVM } from '@viewmodel/users/user-list-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<UserCreatePageInput>();
  return (
    <UserCreateScreen vm={createUserCreateVM(input)} list={createUserListVM(input.background)} />
  );
}
