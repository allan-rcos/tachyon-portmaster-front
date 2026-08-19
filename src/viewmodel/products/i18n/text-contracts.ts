/**
 * Contratos de texto do domínio de produtos.
 *
 * O contrato mora no ViewModel — não na View — porque é o ViewModel que
 * PRODUZ o texto (resolvendo o catálogo i18n para um locale) e a View que o
 * CONSOME. Declará-lo aqui é o que mantém a direção da dependência
 * (view → viewmodel) e permite que os catálogos em `./*.messages.ts` sejam
 * tipados sem enxergar nenhum componente.
 *
 * O `tsc` fecha o ciclo: se um catálogo esquecer uma chave, a atribuição ao
 * contrato falha no build — não na tela.
 *
 * @packageDocumentation
 */
import type { ProductSchemaText } from '@viewmodel/products/schemas/product.schema';

/** Chaves de texto que a listagem de produtos consome. */
export interface ProductListText {
  /** Linha de contexto em caixa alta, acima do título. */
  eyebrow: string;
  /** Rótulo da coluna de identificador. */
  id: string;
  title: string;
  subtitle: string;
  new: string;
  name: string;
  density: string;
  riskClass: string;
  actions: string;
  edit: string;
  empty: string;
  /** Rótulo do campo de busca — vem do `commonText`. */
  search: string;
  /** Rótulo do botão que traz a próxima página do cursor. */
  loadMore: string;
}

/** Chaves de texto do formulário de produto (criação e edição). */
export interface ProductFormText extends ProductSchemaText {
  data: string;
  name: string;
  density: string;
  riskClass: string;
  submitError: string;
  create: string;
  save: string;
  cancel: string;
  delete: string;
  deleteConfirm: string;
  /** Rótulo acessível do "fechar" do modal — vem do `commonText`. */
  close: string;
}
