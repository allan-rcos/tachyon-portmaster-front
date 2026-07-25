import { loadSystemInfoPage, type SystemInfoPageData } from '@viewmodel/system/system-info-page.vm';
import type { PageContextServer } from 'vike/types';


export type DataProps = SystemInfoPageData;

/** Casca do Vike: delega ao ViewModel (esta rota não usa o PageContext). */
export const data = (_pageContext: PageContextServer): DataProps => loadSystemInfoPage();
