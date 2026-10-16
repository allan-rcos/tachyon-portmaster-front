/**
 * Ícone da aba — o emblema "Volt" da marca.
 *
 * Mora em arquivo próprio, como `+title.ts` e `+lang.ts`: o Vike exige valor de
 * config serializável, e aqui há um import de asset a resolver. O `vike-solid`
 * consome esta config e emite o `<link rel="icon">`, então nada disso precisa
 * ser montado à mão no `+Head`.
 *
 * O `?url` faz o Vite tratar o `.ico` como asset: ele sai no `dist/client` com
 * hash no nome e a string aqui vira o caminho final. É o mesmo caminho que as
 * fontes do design system já percorrem, e por isso o arquivo pode continuar
 * morando dentro do pacote da marca em vez de num `public/` paralelo.
 *
 * @packageDocumentation
 */

/**
 * O alias `@ds-assets` causava erro de módulo não encontrado neste import do
 * favicon; o caminho relativo aponta diretamente para o arquivo no submodule
 * e permite ao Vite processá-lo como asset por meio do sufixo `?url`.
 * */
import faviconUrl from '../packages/tachyon-design/assets/logo/favicon.ico?url';

export default faviconUrl;
