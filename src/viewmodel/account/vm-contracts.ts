/**
 * Contratos de ViewModel da conta — a superfície que cada peça da tela consome.
 *
 * Moram aqui pelo mesmo motivo dos contratos de texto: quem **produz** o objeto
 * é o ViewModel, quem consome é a View. Ver
 * {@link "src/viewmodel/users/vm-contracts" | @viewmodel/users/vm-contracts}
 * para o raciocínio completo.
 *
 * A rota é uma só, mas a tela tem TRÊS peças independentes — o resumo, o
 * formulário de dados e a troca de senha — e cada uma enxerga apenas a sua
 * fatia. É por isso que há três contratos e um único
 * {@link "src/viewmodel/account/account-page.vm" | AccountPageVM} que os
 * satisfaz.
 *
 * @packageDocumentation
 */
import type {
  AccountFormText,
  AccountProfileText,
  PasswordChangeText,
} from './i18n/text-contracts';

/** Campos do formulário de dados da conta. */
export type ProfileField = 'name' | 'email';

/** Campos do formulário de troca de senha. */
export type PasswordField = 'current_password' | 'new_password';

/** Um perfil vinculado ao usuário, pronto para desenhar. */
export interface AccountRoleData {
  /** Id opaco, usado como chave de lista. */
  id: string;
  /** Nome do perfil. */
  name: string;
  /** Contagem de permissões já interpolada (ex.: `'12 permissões'`). */
  permissionsLabel: string;
}

/** Identidade do usuário autenticado, em formato de apresentação. */
export interface AccountIdentity {
  /** Nome do usuário. */
  name: string;
  /** E-mail do usuário. */
  email: string;
}

/**
 * O que o resumo da conta precisa da rota — só leitura, nada do estado dos
 * formulários que dividem a tela com ele.
 */
export interface AccountProfileVM {
  /** Texto do resumo. */
  t: AccountProfileText;
  /** Identidade do usuário. */
  identity: AccountIdentity;
  /** Perfis vinculados. */
  roles: readonly AccountRoleData[];
}

/** O que o formulário de dados da conta precisa da rota. */
export interface AccountFormVM {
  /** Texto do formulário. */
  t: AccountFormText;
  /** Valor atual de um campo de perfil. */
  profileValue: (field: ProfileField) => string;
  /** Erro de um campo de perfil, só depois de tocado. */
  profileError: (field: ProfileField) => string | undefined;
  /** Uma gravação de perfil está em voo. */
  savingProfile: () => boolean;
  /** A última gravação de perfil falhou na API. */
  profileFailed: () => boolean;
  /** Escreve um campo de perfil. */
  setProfile: (field: ProfileField, value: string) => void;
  /** Marca um campo de perfil como tocado. */
  blurProfile: (field: ProfileField) => void;
  /**
   * Valida e grava os próprios dados. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se gravou; a View então recarrega, porque o nome aparece
   *          também no rodapé da barra lateral.
   */
  saveProfile: () => Promise<boolean>;
}

/**
 * O que a troca de senha precisa da rota.
 *
 * Independente do {@link AccountFormVM}: são dois formulários na mesma tela,
 * com estados que não se tocam.
 */
export interface PasswordChangeVM {
  /** Texto da troca de senha. */
  t: PasswordChangeText;
  /** Valor atual de um campo de senha. */
  passwordValue: (field: PasswordField) => string;
  /** Erro de um campo de senha, só depois de tocado. */
  passwordError: (field: PasswordField) => string | undefined;
  /** Uma troca de senha está em voo. */
  changingPassword: () => boolean;
  /** A última troca de senha falhou na API. */
  passwordFailed: () => boolean;
  /** A última troca de senha concluiu — acende a confirmação na tela. */
  passwordChanged: () => boolean;
  /** Escreve um campo de senha. */
  setPassword: (field: PasswordField, value: string) => void;
  /** Marca um campo de senha como tocado. */
  blurPassword: (field: PasswordField) => void;
  /**
   * Valida e troca a própria senha. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se trocou; os campos são limpos junto.
   */
  changePassword: () => Promise<boolean>;
}
