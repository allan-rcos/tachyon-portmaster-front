// ============================================================
//  Vocabulário de UI transversal (Paraglide). Não é catálogo: são só os
//  termos que várias páginas repetem (salvar/cancelar/ações/nav). Cada
//  página ESPALHA `commonText(locale)`/`navText(locale)` no seu `t` e
//  sobrescreve o que precisar. Locale sempre explícito → resolvido em SSR.
// ============================================================
import type { Locale } from './locale';

import { m } from '@/paraglide/messages';

/** Contratos nomeados dos fragmentos transversais — usados para tipar de forma
 *  estrita os resolvers que os espalham (evita retorno inferido/"dinâmico").
 *  Os valores são `string` (não a marca `LocalizedString` do Paraglide) para
 *  casar com os contratos dos componentes/ilhas, que recebem texto puro. */
export type CommonText = { [K in keyof ReturnType<typeof commonText>]: string };
export type ValText = { [K in keyof ReturnType<typeof valText>]: string };
export type NavText = { [K in keyof ReturnType<typeof navText>]: string };

/**
 * Termos de UI compartilhados — as páginas espalham no seu `t`.
 * @param locale Locale já resolvido pelo contexto.
 */
export function commonText(locale: Locale) {
  return {
    new: m.common_new({}, { locale }),
    edit: m.common_edit({}, { locale }),
    delete: m.common_delete({}, { locale }),
    save: m.common_save({}, { locale }),
    create: m.common_create({}, { locale }),
    cancel: m.common_cancel({}, { locale }),
    confirm: m.common_confirm({}, { locale }),
    actions: m.common_actions({}, { locale }),
    search: m.common_search({}, { locale }),
    loading: m.common_loading({}, { locale }),
    empty: m.common_empty({}, { locale }),
    submitError: m.common_submit_error({}, { locale }),
    back: m.common_back({}, { locale }),
    logout: m.common_logout({}, { locale }),
    previous: m.common_previous({}, { locale }),
    next: m.common_next({}, { locale }),
    loadMore: m.common_load_more({}, { locale }),
    id: m.common_id({}, { locale }),
  };
}

/**
 * Mensagens de validação (Zod) compartilhadas pelos formulários. Cada schema
 * declara seu contrato local com o subconjunto que usa; a página/form espalha
 * `valText(locale)` no `t` que entrega ao schema.
 * @param locale Locale já resolvido pelo contexto.
 */
export function valText(locale: Locale) {
  return {
    nameShort: m.val_name_short({}, { locale }),
    nameLong: m.val_name_long({}, { locale }),
    emailRequired: m.val_email_required({}, { locale }),
    emailInvalid: m.val_email_invalid({}, { locale }),
    passwordRequired: m.val_password_required({}, { locale }),
    passwordMin: m.val_password_min({}, { locale }),
    currentPasswordRequired: m.val_current_password_required({}, { locale }),
    rolesRequired: m.val_roles_required({}, { locale }),
    permissionsRequired: m.val_permissions_required({}, { locale }),
    codeShort: m.val_code_short({}, { locale }),
    codeLong: m.val_code_long({}, { locale }),
    codeFormat: m.val_code_format({}, { locale }),
    capacityPositive: m.val_capacity_positive({}, { locale }),
    capacityFormat: m.val_capacity_format({}, { locale }),
    densityPositive: m.val_density_positive({}, { locale }),
    densityFormat: m.val_density_format({}, { locale }),
    quantityPositive: m.val_quantity_positive({}, { locale }),
    quantityFormat: m.val_quantity_format({}, { locale }),
    productRequired: m.val_product_required({}, { locale }),
  };
}

/**
 * Rótulos de navegação (sidebar/breadcrumbs) — compostos pelas páginas.
 * @param locale Locale já resolvido pelo contexto.
 */
export function navText(locale: Locale) {
  return {
    painel: m.nav_painel({}, { locale }),
    conteineres: m.nav_conteineres({}, { locale }),
    produtos: m.nav_produtos({}, { locale }),
    usuarios: m.nav_usuarios({}, { locale }),
    perfis: m.nav_perfis({}, { locale }),
    conta: m.nav_conta({}, { locale }),
    administration: m.nav_administration({}, { locale }),
  };
}
