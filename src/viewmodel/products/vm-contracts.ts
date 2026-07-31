/**
 * Contratos de ViewModel de produtos — a superfície que cada peça da tela
 * consome.
 *
 * Moram aqui pelo mesmo motivo dos contratos de texto: quem **produz** o objeto
 * é o ViewModel, quem consome é a View. Ver
 * {@link "src/viewmodel/users/vm-contracts" | @viewmodel/users/vm-contracts}
 * para o raciocínio completo.
 *
 * @packageDocumentation
 */
import type { SelectOption } from '@viewmodel/core/page/options';

import type { ProductFormText } from './i18n/text-contracts';

/** Campos do formulário de produto. */
export type ProductField = 'name' | 'density' | 'risk_class';

/**
 * O que o formulário de produto precisa da rota — satisfeito tanto pela
 * criação quanto pela edição.
 */
export interface ProductFormVM {
  /** Texto da tela. */
  t: ProductFormText;
  /** Destino do cancelar e da navegação após salvar. */
  listHref: string;
  /** Classes de risco do seletor. */
  riskOptions: readonly SelectOption[];
  /** Decide o rótulo do botão e a presença do "excluir". */
  mode: 'create' | 'edit';
  /** Valor atual de um campo. */
  value: (field: ProductField) => string;
  /** Erro de um campo, só depois de tocado (ou de uma tentativa de envio). */
  error: (field: ProductField) => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API. */
  failed: () => boolean;
  /** Escreve um campo. */
  set: (field: ProductField, value: string) => void;
  /** Marca um campo como tocado, liberando o erro dele. */
  blur: (field: ProductField) => void;
  /**
   * Valida e grava. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se gravou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;
  /**
   * Exclui o produto. Só em edição.
   *
   * REJEITA em caso de falha, ao contrário de `submit`: quem chama é o
   * `ConfirmDialog`, que tem estado de erro próprio e espera uma promise crua.
   */
  remove?: () => Promise<void>;
}
