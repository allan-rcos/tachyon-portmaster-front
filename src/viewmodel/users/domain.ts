// ============================================================
//  Vocabulário de dados de users, reexportado do Model para a View.
//
//  A View não importa `@model` diretamente (regra de dependência aplicada no
//  eslint). Reexportar apenas o submódulo `dto` — que contém tipos e enums,
//  nunca funções de API — garante estruturalmente que nenhuma chamada de rede
//  vaze para a camada de interface: o que não está aqui, a View não alcança.
// ============================================================
export * from '@model/users/dto';
