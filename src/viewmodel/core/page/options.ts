// ============================================================
//  Opções de escolha (select, checkbox) como DADO de apresentação.
//
//  O valor é `string` de propósito: a View não precisa saber que ele é um
//  `Permission` ou um `RiskClass` — ela renderiza um controle e devolve o que o
//  usuário escolheu. Quem garante que o valor é do enum certo é o schema, na
//  submissão. Isso é o que tira o último DTO do Model de dentro da View.
//
//  Serializável: viaja no `PageInput`.
// ============================================================

/** Uma escolha: valor opaco + rótulo já traduzido. */
export interface SelectOption {
  value: string;
  label: string;
}

/** Escolhas agrupadas sob um título (ex.: a matriz de permissões por recurso). */
export interface OptionGroup {
  label: string;
  options: readonly SelectOption[];
}
