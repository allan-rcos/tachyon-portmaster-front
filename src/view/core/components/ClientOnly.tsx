import type { JSX } from 'solid-js';
import { ClientOnly as VikeClientOnly } from 'vike-solid/ClientOnly';

export interface ClientOnlyProps {
  /** Conteúdo que só pode existir no navegador. */
  children: JSX.Element;
  /** O que ocupa o lugar dele durante o SSR e até a hidratação. */
  fallback: JSX.Element;
}

/**
 * Adia a renderização para o navegador.
 *
 * Só existe para ser o **único ponto da View que enxerga o `vike-solid`**:
 * nenhum outro arquivo de `src/view` importa `vike*`. Trocar de framework de
 * rota passa a ser trocar este arquivo.
 *
 * Use com parcimônia. O padrão é renderizar no servidor — este componente é
 * para o que genuinamente não existe lá (uma medida do viewport, um `<canvas>`,
 * uma API só de navegador), não para esconder que a tela ainda não busca dados.
 * O `fallback` é obrigatório: sem ele o layout salta na hidratação.
 */
export function ClientOnly(props: ClientOnlyProps): JSX.Element {
  return <VikeClientOnly fallback={props.fallback}>{props.children}</VikeClientOnly>;
}
