/**
 * O design system — funções `(props) => JSX.Element`, sem estado e sem
 * dependência de feature.
 *
 * São renderizadas no servidor como qualquer outro componente: não há hidratação,
 * não há ciclo de vida, e o SCSS de cada uma vem do `.module.scss` irmão (as
 * `.module.scss.d.ts` são geradas por `bun run gen:css` e não versionam
 * significado).
 *
 * @packageDocumentation
 */
export * from './Badge';
export * from './Brand';
export * from './Breadcrumbs';
export * from './Card';
export * from './CardList';
export * from './ClientOnly';
export * from './EmptyState';
export * from './ErrorPage';
export * from './FilterTabs';
export * from './FormField';
export * from './Icon';
export * from './Navbar';
export * from './PageHeader';
export * from './RowList';
export * from './Sidebar';
export * from './Skeleton';
export * from './Toolbar';
