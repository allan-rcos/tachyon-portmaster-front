import type { Renderable } from '@view/core/types';
import { clientOnly as clientOnlyImpl } from 'vike-lit/ClientOnly';

/**
 * Adia conteúdo para depois da hidratação.
 *
 * Só existe para ser o **único ponto da View que enxerga a integração de
 * rota**: nenhum outro arquivo de `src/view` importa `vike*`. Trocar de
 * framework de rota passa a ser trocar este arquivo.
 *
 * Use com parcimônia. O padrão é renderizar no servidor — isto é para o que
 * genuinamente não existe lá (uma medida do viewport, um `<canvas>`, uma API só
 * de navegador), não para esconder que a tela ainda não busca dados.
 *
 * O `children` é um thunk: no servidor ele simplesmente não é chamado. O
 * `fallback` é obrigatório — sem ele o layout salta quando o conteúdo entra.
 *
 * @param children Conteúdo que só pode existir no navegador.
 * @param fallback O que ocupa o lugar dele durante o SSR e até a hidratação.
 */
export function clientOnly(children: () => Renderable, fallback: Renderable): Renderable {
  return clientOnlyImpl(children, fallback) as Renderable;
}
