import type { PageContext, PageContextClient, PageContextServer } from 'vike/types';

import type { ConfigsCumulative } from '../hooks/useConfig/configsCumulative.js';
import type { Viewport } from '../integration/onRenderHtml.js';
import type { TagAttributes } from '../utils/getTagAttributesString.js';
import type { Renderable } from './Renderable.js';

// https://vike.dev/meta#typescript
declare global {
  namespace Vike {
    interface Config {
      /**
       * A fábrica da página.
       *
       * Chamada uma vez por render de página, com o `pageContext`; devolve um
       * thunk que o runtime reavalia a cada mudança de sinal.
       *
       * https://vike.dev/Page
       */
      Page?: PageFactory;

      /**
       * Add arbitrary `<head>` tags.
       *
       * https://vike.dev/Head
       */
      Head?: Head;

      /**
       * A component that defines the visual layout common to several pages.
       *
       * Technically: the `Layout` wraps the page's template.
       *
       * https://vike.dev/Layout
       */
      Layout?: LayoutComponent;

      /**
       * A component wrapping the page's template, outside of `Layout`.
       *
       * https://vike.dev/Wrapper
       */
      Wrapper?: LayoutComponent;

      /**
       * Set the page's title.
       *
       * Generates:
       * ```html
       * <head>
       *   <title>{title}</title>
       *   <meta property="og:title" content={title} />
       * </head>
       * ```
       *
       * https://vike.dev/title
       */
      title?: string | null | ((pageContext: PageContext_) => string | null | undefined);

      /**
       * Set the page's description.
       *
       * https://vike.dev/description
       */
      description?: string | null | ((pageContext: PageContextServer) => string | null | undefined);

      /**
       * Set the page's preview image upon URL sharing.
       *
       * https://vike.dev/image
       */
      image?: string | null | ((pageContext: PageContextServer) => string | null | undefined);

      /**
       * Set the page's width shown to the user on mobile/tablet devices.
       *
       * @default "responsive"
       *
       * https://vike.dev/viewport
       */
      viewport?: Viewport | ((pageContext: PageContextServer) => Viewport | undefined);

      /**
       * Set the page's favicon.
       *
       * https://vike.dev/favicon
       */
      favicon?: string | null | ((pageContext: PageContextServer) => string | null | undefined);

      /**
       * Set the page's language (`<html lang>`).
       *
       * @default 'en'
       *
       * https://vike.dev/lang
       */
      lang?: string | null | ((pageContext: PageContext_) => string | null | undefined);

      /**
       * Add tag attributes such as `<html class="dark">`.
       *
       * https://vike.dev/htmlAttributes
       */
      htmlAttributes?:
        TagAttributes | ((pageContext: PageContextServer) => TagAttributes | undefined);

      /**
       * Add tag attributes such as `<body class="dark">`.
       *
       * https://vike.dev/bodyAttributes
       */
      bodyAttributes?:
        TagAttributes | ((pageContext: PageContextServer) => TagAttributes | undefined);

      /**
       * If `true`, the page is rendered twice: on the server-side (to HTML) and on the client-side (hydration).
       *
       * If `false`, the page is rendered only once in the browser.
       *
       * @default true
       *
       * https://vike.dev/ssr
       */
      ssr?: boolean;

      /**
       * Settings for HTML Streaming.
       *
       * Só o tipo `web` é suportado: o `node` exigiria o `stream` do Node, que o
       * runtime alvo (txiki.js) não tem. Ver `renderToWebStream`.
       *
       * https://vike.dev/stream
       */
      stream?:
        | boolean
        | 'web'
        | {
            /** Só `web` — ver acima. */
            type?: 'web';
            /**
             * Setting +stream to `{ enable: null }` is the same as not setting +stream at all.
             */
            enable?: boolean | null;
          };

      /**
       * Client-side hook called after the page is rendered.
       *
       * https://vike.dev/onAfterRenderClient
       */
      onAfterRenderClient?: (pageContext: PageContextClient) => void;
    }
    interface ConfigResolved {
      Layout?: Array<LayoutComponent>;
      Wrapper?: Array<LayoutComponent>;
      Head?: Array<Head>;
      bodyAttributes?: TagAttributes[];
      htmlAttributes?: TagAttributes[];
      onAfterRenderClient?: Array<(pageContext: PageContextClient) => void>;
      stream?: Array<Vike.Config['stream']>;
    }
  }
}

// Be able to reference it from within `namespace Vike`
// - https://stackoverflow.com/questions/46559021/typescript-use-of-global-type-inside-namespace-with-same-type
type PageContext_ = PageContext;

/** O template da página, reavaliado a cada render. */
export type PageView = () => Renderable;

/** O default export de `+Page.ts`: recebe o `pageContext` e devolve o thunk. */
export type PageFactory = (pageContext: PageContext) => PageView;

/**
 * `+Layout.ts` / `+Wrapper.ts`: embrulha o conteúdo já desenhado.
 *
 * Recebe `pageContext` por argumento em vez de por hook — não há
 * `usePageContext()` aqui, de propósito.
 */
export type LayoutComponent = (pageContext: PageContext, children: Renderable) => Renderable;

/** `+Head.ts`: markup extra para o `<head>`. */
export type Head = Renderable | ((pageContext: PageContext) => Renderable);

// JSDocs are preserved
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], (...args: never[]) => unknown>;
};
export type ConfigFromHook = PickWithoutGetter<
  Vike.Config,
  | 'Head'
  | 'title'
  | 'description'
  | 'image'
  | 'favicon'
  | 'lang'
  | 'viewport'
  | 'bodyAttributes'
  | 'htmlAttributes'
>;
export type ConfigFromHookResolved = Omit<ConfigFromHook, ConfigsCumulative> &
  Pick<Vike.ConfigResolved, ConfigsCumulative>;
export type Stream = { write: (v: string) => void };

export type { Renderable };
