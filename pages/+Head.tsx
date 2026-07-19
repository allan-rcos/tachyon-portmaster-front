import type { JSX } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

// Script anti-FOUC: lê o cookie `flow-theme` e aplica `data-theme`
// antes da primeira pintura. Tema padrão = escuro (sem atributo).
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )flow-theme=([^;]+)/);var t=m?decodeURIComponent(m[1]):'dark';if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

// <head> global e ÚNICo +Head (o Vike acumula +Head pela árvore de
// diretórios; manter um só evita <title> duplicado). O título vem de
// `data.title`, devolvido por cada +data.ts. App autenticada → noindex.
const DEFAULT_DESCRIPTION = 'Sistema de Alocação de Contêineres e Carga';

export default function Head(): JSX.Element {
  const pageContext = usePageContext();
  const data = () => pageContext.data as { title?: string; description?: string } | undefined;
  const title = () => {
    const t = data()?.title;
    return t ? `${t} — PortMaster` : 'Tachyon PortMaster';
  };
  const description = () => data()?.description ?? DEFAULT_DESCRIPTION;
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="color-scheme" content="dark light" />
      <meta name="robots" content="noindex" />
      <title>{title()}</title>
      <meta name="description" content={description()} />
      <script innerHTML={themeScript} />
    </>
  );
}
