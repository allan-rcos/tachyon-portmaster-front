/**
 * O `<html lang>` de cada rota — o locale que o PREFIXO da URL indica.
 *
 * Era um literal `lang: 'pt-BR'` no `+config.js`, o que ficou errado assim que
 * o idioma virou endereço: `/en/entrar` servia texto em inglês dentro de um
 * documento anunciado como português. Isso não é cosmético — é o atributo que
 * leitor de tela usa para escolher a voz e que buscador usa para indexar.
 *
 * Como `+title.ts`, mora em arquivo próprio porque o Vike exige que valor de
 * config seja serializável: código vai em `+lang.ts`, que o `vike-solid` chama
 * com o pageContext.
 *
 * @packageDocumentation
 */
import { localeFromUrl } from '@viewmodel/core/i18n/locale';
import type { PageContext } from 'vike/types';

/**
 * Locale do documento, lido do prefixo da URL.
 *
 * Usa `urlOriginal` porque o `+onBeforeRoute` já tirou o prefixo de
 * `urlLogical` — o endereço cru é o único lugar onde o idioma ainda está.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function lang(pageContext: PageContext): string {
  return localeFromUrl(pageContext.urlOriginal);
}
