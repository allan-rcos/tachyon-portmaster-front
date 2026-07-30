/**
 * Composição de `/info` — Informação de sistema: versão, build e saúde.
 *
 * Único ponto onde View e ViewModel se encontram para esta rota: constrói o VM a
 * partir do `pageContext.data` e devolve a tela. Sem markup, sem CSS, sem lógica.
 *
 * @packageDocumentation
 */
import { SystemInfoScreen } from '@view/info/screens/SystemInfoScreen';
import {
  createSystemInfoVM,
  type SystemInfoPageInput,
} from '@viewmodel/system/system-info-page.vm';
import type { PageContext } from 'vike/types';
import type { PageView } from 'vike-lit/types';

/**
 * Único ponto de composição da rota.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function Page(pageContext: PageContext): PageView {
  const vm = createSystemInfoVM(pageContext.data as SystemInfoPageInput);
  return () => SystemInfoScreen({ vm });
}
