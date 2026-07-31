/**
 * Composição de `/entrar` — Login — a única rota pública. Renderiza fora do AppShell.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `data` que o `+data` resolveu e devolve a tela. Sem markup, sem CSS,
 * sem lógica.
 *
 * @packageDocumentation
 */
import { LoginPage } from '@view/auth/components/LoginPage';
import { createLoginVM } from '@viewmodel/auth/login-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

import type { Data } from './+data';

/**
 * Único ponto de composição da rota: pega o dado que o `+data` resolveu e
 * constrói o ViewModel a partir dele.
 *
 * O corpo do componente roda UMA vez por montagem, então o VM — e com ele o
 * estado do formulário — sobrevive aos re-renders. Se fosse construído dentro do
 * JSX, cada tecla digitada o recriaria zerado.
 */
export default function Page(): JSX.Element {
  const vm = createLoginVM(useData<Data>());
  return <LoginPage vm={vm} />;
}
