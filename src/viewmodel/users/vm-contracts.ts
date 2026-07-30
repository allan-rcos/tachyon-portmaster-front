/**
 * Contratos de ViewModel de usuários — a superfície que cada peça da tela
 * consome.
 *
 * Moram aqui pelo mesmo motivo dos contratos de texto: quem **produz** o objeto
 * é o ViewModel, quem consome é a View. Se a interface morasse no componente, o
 * ViewModel dependeria da View para se tipar — a regra de dependência
 * invertida. Com ela aqui, o `tsc` cobra a superfície na declaração do VM, e
 * não só no ponto onde a tela recebe o `vm`.
 *
 * Um contrato por PEÇA, não por rota: `/usuarios/nova` e
 * `/usuarios/@id/editar` satisfazem o mesmo {@link UserFormVM}, e é isso que
 * permite ao formulário ser um componente só.
 *
 * @packageDocumentation
 */
import type { UserAdminActionsText, UserFormText } from './i18n/text-contracts';

/** Campos de texto do formulário de usuário. */
export type UserField = 'name' | 'email' | 'initial_password';

/** Opção de perfil oferecida no formulário. */
export interface RoleOption {
  /** Id opaco base62 do perfil. */
  id: string;
  /** Nome exibido na opção. */
  name: string;
}

/**
 * O que o formulário de usuário precisa da rota — satisfeito tanto pela
 * criação quanto pela edição.
 */
export interface UserFormVM {
  /** Texto da tela. */
  t: UserFormText;
  /** Perfis disponíveis para vincular. */
  roles: readonly RoleOption[];
  /** Destino do cancelar e da navegação após salvar. */
  listHref: string;
  /** Decide o rótulo do botão e a presença da senha inicial. */
  mode: 'create' | 'edit';
  /** Valor atual de um campo de texto. */
  value: (field: UserField) => string;
  /** Erro de um campo, só depois de tocado (ou de uma tentativa de envio). */
  error: (field: UserField) => string | undefined;
  /** Um perfil está vinculado? */
  hasRole: (roleId: string) => boolean;
  /**
   * Erro da seleção de perfis.
   *
   * Separado dos campos de texto porque não há "tocar" um grupo de caixas: o
   * erro aparece depois da primeira tentativa de envio.
   */
  rolesError: () => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API. */
  failed: () => boolean;
  /** Escreve um campo de texto. */
  set: (field: UserField, value: string) => void;
  /** Marca um campo como tocado, liberando o erro dele. */
  blur: (field: UserField) => void;
  /** Liga ou desliga o vínculo com um perfil. */
  toggleRole: (roleId: string, on: boolean) => void;
  /**
   * Valida e grava. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se gravou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;
}

/** O que as ações administrativas precisam da rota de edição. */
export interface UserAdminActionsVM {
  /** Texto das ações. */
  t: UserAdminActionsText;
  /** Destino depois de excluir. */
  listHref: string;
  /** Nova senha digitada no reset. */
  newPassword: () => string;
  /** Erro da nova senha, depois da primeira tentativa de reset. */
  newPasswordError: () => string | undefined;
  /** Um reset está em voo. */
  resetting: () => boolean;
  /** O último reset concluiu — é o que acende a confirmação na tela. */
  resetDone: () => boolean;
  /** Escreve a nova senha. */
  setNewPassword: (value: string) => void;
  /**
   * Redefine a senha do usuário. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se redefiniu; o campo é limpo junto.
   */
  resetPassword: () => Promise<boolean>;
  /**
   * Exclui o usuário.
   *
   * REJEITA na falha: quem chama é o `ConfirmDialog`, que tem estado de erro
   * próprio.
   */
  remove: () => Promise<void>;
}
