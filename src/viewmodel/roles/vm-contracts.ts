/**
 * Contratos de ViewModel de perfis — a superfície que a View consome.
 *
 * Moram aqui pelo mesmo motivo dos contratos de texto: quem **produz** o objeto
 * é o ViewModel, quem consome é a View. Ver
 * {@link "src/viewmodel/users/vm-contracts" | @viewmodel/users/vm-contracts}
 * para o raciocínio completo.
 *
 * @packageDocumentation
 */
import type { OptionGroup } from '@viewmodel/core/page/options';

import type { RoleFormText } from './i18n/text-contracts';

/**
 * O que o formulário de perfil precisa da rota — satisfeito tanto pela criação
 * quanto pela edição da matriz de permissões.
 *
 * Os dois modos compartilham o formulário porque a matriz é a mesma; o que
 * muda é se o nome é campo editável ou `<output>`.
 */
export interface RoleFormVM {
  /** Texto da tela. */
  t: RoleFormText;
  /** Matriz de permissões, com rótulos já resolvidos pelo ViewModel. */
  permissionGroups: readonly OptionGroup[];
  /** Destino do cancelar e da navegação após salvar. */
  listHref: string;
  /** Decide o rótulo do botão e se o nome é campo ou `<output>`. */
  mode: 'create' | 'permissions';
  /** Nome do perfil. */
  name: () => string;
  /** Erro do nome, só depois de tocado (ou de uma tentativa de envio). */
  nameError: () => string | undefined;
  /** Uma permissão está concedida? */
  hasPermission: (value: string) => boolean;
  /**
   * Erro da matriz de permissões.
   *
   * Separado do nome porque não existe "tocar" uma matriz de caixas: o erro
   * aparece depois da primeira tentativa de envio.
   */
  permissionsError: () => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API. */
  failed: () => boolean;
  /** Escreve o nome. Não faz nada no modo `permissions`. */
  setName: (value: string) => void;
  /** Marca o nome como tocado, liberando o erro dele. */
  blurName: () => void;
  /** Liga ou desliga uma permissão. */
  togglePermission: (value: string, on: boolean) => void;
  /**
   * Valida e grava. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se gravou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;
}
