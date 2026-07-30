/**
 * Vocabulário transversal — os tipos e enums que aparecem em mais de um recurso
 * (status, risco, permissões). Fica aqui, e não duplicado em cada `dto.ts`,
 * porque é o que permite o ViewModel comparar entidades de recursos diferentes
 * sem inventar um terceiro tipo.
 *
 * @packageDocumentation
 */
export * from './dto';
