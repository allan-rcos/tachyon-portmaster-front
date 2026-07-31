/**
 * Contratos de ViewModel de contêineres — a superfície que cada peça da tela
 * consome.
 *
 * Moram aqui pelo mesmo motivo dos contratos de texto: quem **produz** o objeto
 * é o ViewModel, quem consome é a View. Ver
 * {@link "src/viewmodel/users/vm-contracts" | @viewmodel/users/vm-contracts}
 * para o raciocínio completo.
 *
 * A rota de detalhe é a que mais se beneficia: ela satisfaz TRÊS contratos ao
 * mesmo tempo ({@link ContainerActionsVM}, {@link ManifestEditorVM} e o resto
 * da tela), e antes isso só se descobria lendo os três componentes.
 *
 * @packageDocumentation
 */
import type { ContainerDetailText, ContainerFormText } from './i18n/text-contracts';

/** Campos do formulário de contêiner. */
export type ContainerField = 'code' | 'max_capacity';

/** Campos do editor de manifesto. */
export type ManifestField = 'product_id' | 'quantity';

/** Opção de produto oferecida no editor de manifesto. */
export interface ProductOption {
  /** Id opaco base62 do produto. */
  id: string;
  /** Nome exibido na opção. */
  name: string;
}

/**
 * O que o formulário de contêiner precisa da rota — satisfeito tanto pelo
 * registro quanto pela edição.
 */
export interface ContainerFormVM {
  /** Texto da tela. */
  t: ContainerFormText;
  /** Destino do cancelar e da navegação após salvar. */
  listHref: string;
  /** Decide o rótulo do botão e se o código é editável. */
  mode: 'create' | 'edit';
  /** Valor atual de um campo. */
  value: (field: ContainerField) => string;
  /** Erro de um campo, só depois de tocado (ou de uma tentativa de envio). */
  error: (field: ContainerField) => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API. */
  failed: () => boolean;
  /** Escreve um campo. */
  set: (field: ContainerField, value: string) => void;
  /** Marca um campo como tocado, liberando o erro dele. */
  blur: (field: ContainerField) => void;
  /**
   * Valida e grava. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se gravou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;
}

/** O que as ações de ciclo de vida precisam da rota de detalhe. */
export interface ContainerActionsVM {
  /** Texto da tela. */
  t: ContainerDetailText;
  /** Volta para a listagem, depois de excluir. */
  listHref: string;
  facts: {
    /** Se lacrar é permitido — decidido pelo ViewModel, que conhece o status. */
    canSeal: boolean;
    /** Se despachar é permitido. */
    canDispatch: boolean;
  };
  /** Lacra o contêiner. Só ofertada quando `facts.canSeal`. */
  seal: () => Promise<void>;
  /** Despacha o contêiner. Só ofertada quando `facts.canDispatch`. */
  dispatch: () => Promise<void>;
  /** Exclui o contêiner. REJEITA na falha — quem chama é o `ConfirmDialog`. */
  remove: () => Promise<void>;
}

/** O que o editor de manifesto precisa da rota de detalhe. */
export interface ManifestEditorVM {
  /** Texto da tela. */
  t: ContainerDetailText;
  /** Catálogo oferecido pelo seletor de produto. */
  products: readonly ProductOption[];
  /** Valor atual de um campo do editor. */
  manifestValue: (field: ManifestField) => string;
  /** Erro de um campo do editor. */
  manifestError: (field: ManifestField) => string | undefined;
  /**
   * Uma operação de manifesto está em voo.
   *
   * Não há `manifestFailed`: este editor nunca teve faixa de erro.
   */
  manifestPending: () => boolean;
  /** Escreve um campo do editor. */
  setManifest: (field: ManifestField, value: string) => void;
  /** Marca um campo do editor como tocado. */
  blurManifest: (field: ManifestField) => void;
  /** Carrega o item no manifesto. Nunca rejeita — o erro vira estado. */
  load: () => Promise<boolean>;
  /** Descarrega o item do manifesto. Nunca rejeita. */
  unload: () => Promise<boolean>;
}
