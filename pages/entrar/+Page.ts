import { LoginPage } from '@view/auth/components/LoginPage';
import { createLoginVM } from '@viewmodel/auth/login-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

import type { Data } from './+data';

/**
 * Único ponto de composição da rota: pega o dado que o `+data` resolveu e
 * constrói o ViewModel a partir dele.
 *
 * A fábrica roda UMA vez por página; o thunk que ela devolve é o que o laço de
 * render reavalia. É isso que faz o estado do formulário sobreviver aos
 * re-renders — se o VM fosse construído dentro do thunk, cada tecla digitada o
 * recriaria zerado.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createLoginVM(pageContext.data as Data);
  return () => LoginPage({ vm });
}
