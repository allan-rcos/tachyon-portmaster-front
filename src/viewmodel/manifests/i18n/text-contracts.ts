/**
 * Contratos de texto da rota /painel/manifestos.
 *
 * Como nas outras features, o contrato mora no ViewModel — é ele que PRODUZ o
 * texto e a View que o consome. Ver `@viewmodel/products/i18n/text-contracts`
 * para o porquê.
 *
 * @packageDocumentation
 */
import type { LoadItemSchemaText } from '@viewmodel/containers/schemas/manifest.schema';

/** Chaves de texto da tela de movimentação de carga. */
export interface ManifestPageText extends LoadItemSchemaText {
  /** Linha de contexto em caixa alta, acima do título. */
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Título do cartão do formulário. */
  move: string;
  /** Rótulos das duas abas de modo. */
  load: string;
  unload: string;
  /** Descrição que muda com o modo escolhido. */
  loadDesc: string;
  unloadDesc: string;
  container: string;
  product: string;
  quantity: string;
  quantityHint: string;
  /** Rótulo do previsor de peso resultante. */
  weightAfter: string;
  /** Cartão lateral com as regras do domínio. */
  rules: string;
  ruleRisk: string;
  ruleWeight: string;
  ruleSealed: string;
  ruleEmpty: string;
  /** Estados vazios dos dois seletores. */
  noContainers: string;
  noProducts: string;
  selectContainer: string;
  selectProduct: string;
  /** Confirmação após a movimentação. */
  done: string;
  /** Termos transversais que o formulário usa. */
  submitError: string;
  cancel: string;
}
