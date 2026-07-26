// https://vike.dev/onRenderHtml

import isBot from 'isbot-fast';
import { dangerouslySkipEscape, escapeInject, stampPipe } from 'vike/server';
import type { OnRenderHtmlAsync, PageContextServer } from 'vike/types';

import { configsClientSide } from '../hooks/useConfig/configsClientSide.js';
import { renderToString, renderToWebStream } from '../lib/ssr.js';
import type { Head, Renderable } from '../types/Config.js';
import type { PageContextInternal } from '../types/PageContext.js';
import { getTagAttributesString, type TagAttributes } from '../utils/getTagAttributesString.js';
import { includes } from '../utils/includes.js';
import { isCallable } from '../utils/isCallable.js';
import { isNotNullish } from '../utils/isNotNullish.js';
import { isObject } from '../utils/isObject.js';
import { isType } from '../utils/isType.js';
import { objectKeys } from '../utils/objectKeys.js';
import { getHeadSetting } from './getHeadSetting.js';
import { getPageView } from './getPageElement.js';

export { onRenderHtml };

type TPipe = Parameters<typeof stampPipe>[0];

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext: PageContextServer & PageContextInternal,
): ReturnType<OnRenderHtmlAsync> => {
  const pageHtml = await getPageHtml(pageContext);

  const headHtml = await getHeadHtml(pageContext);

  const { htmlAttributesString, bodyAttributesString } = getTagAttributes(pageContext);

  // Keep only what the client-side applies upon navigation, and remove the rest (HTML-only and/or
  // non-serializable values such as Head templates).
  removeServerOnlyConfigFromHook(pageContext);

  // Sem `generateHydrationScript()`: o `@lit-labs/ssr` já emite os marcadores
  // `<!--lit-part-->` no próprio HTML, e é deles que o `hydrate()` do
  // `@lit-labs/ssr-client` se serve. Uma peça a menos que o vike-solid.
  return escapeInject`<!DOCTYPE html>
    <html${dangerouslySkipEscape(htmlAttributesString)}>
      <head>
        <meta charset="UTF-8" />
        ${headHtml}
      </head>
      <body${dangerouslySkipEscape(bodyAttributesString)}>
        <div id="root">${pageHtml}</div>
      </body>
    </html>`;
};

function removeServerOnlyConfigFromHook(pageContext: PageContextInternal) {
  const configFromHook = pageContext._configFromHook;
  if (!configFromHook) return;
  objectKeys(configFromHook).forEach((configName) => {
    if (!includes(configsClientSide, configName)) delete configFromHook[configName];
  });
  // Remove it altogether if there isn't anything left, saving KBs sent to the client
  if (objectKeys(configFromHook).length === 0) delete pageContext._configFromHook;
}

async function getPageHtml(pageContext: PageContextServer & PageContextInternal) {
  let pageHtml: string | ReturnType<typeof dangerouslySkipEscape> | TPipe = '';
  const userAgent: string | undefined =
    pageContext.headers?.['user-agent'] ||
    // TODO/eventually: remove old way of accessing the User Agent header.
    // @ts-expect-error Property 'userAgent' does not exist on type
    pageContext.userAgent;

  if (!pageContext.Page) return pageHtml;

  const view = getPageView(pageContext);
  const streamSetting = resolveStreamSetting(pageContext);

  // A bifurcação existe pelo mesmo motivo do vike-solid — dar HTML completo a
  // quem não executa JS —, mas com uma assimetria a menos: o `renderToString`
  // daqui resolve as Promises do template (é o `collectResult`), então o
  // caminho não-stream JÁ é o caminho completo. No Solid era preciso escolher
  // `renderToStringAsync` para bot, porque o `renderToString` síncrono
  // abandonava o `<Suspense>`.
  if ((userAgent && isBot(userAgent)) || !streamSetting.enable) {
    pageHtml = dangerouslySkipEscape(await renderToString(view()));
  } else {
    // Só Web Stream: o `node` exigiria o `stream` do Node, ausente no txiki.js.
    pageHtml = renderToWebStream(view()) as unknown as TPipe;
    stampPipe(pageHtml, 'web-stream');
  }
  return pageHtml;
}

async function getHeadHtml(pageContext: PageContextServer & PageContextInternal) {
  pageContext._headAlreadySet = true;

  const title = getHeadSetting<string | null>('title', pageContext);
  const favicon = getHeadSetting<string | null>('favicon', pageContext);
  const description = getHeadSetting<string | null>('description', pageContext);
  const image = getHeadSetting<string | null>('image', pageContext);

  const titleTags = !title
    ? ''
    : escapeInject`<title>${title}</title><meta property="og:title" content="${title}">`;
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`;
  const descriptionTags = !description
    ? ''
    : escapeInject`<meta name="description" content="${description}"><meta property="og:description" content="${description}">`;
  const imageTags = !image
    ? ''
    : escapeInject`<meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image">`;
  const viewportTag = dangerouslySkipEscape(
    getViewportTag(getHeadSetting<Viewport>('viewport', pageContext)),
  );

  const headElements = [
    // Added by +Head
    ...ensureArray(pageContext.config.Head),
    // Added by useConfig()
    ...ensureArray(pageContext._configFromHook?.Head),
  ].filter(isNotNullish);

  const headElementsHtml = dangerouslySkipEscape(
    (await Promise.all(headElements.map((Head) => getHeadElementHtml(Head, pageContext)))).join(
      '\n',
    ),
  );

  const headHtml = escapeInject`
    ${titleTags}
    ${viewportTag}
    ${headElementsHtml}
    ${faviconTag}
    ${descriptionTags}
    ${imageTags}
  `;
  return headHtml;
}

function getHeadElementHtml(Head: Head, pageContext: PageContextServer): Promise<string> {
  // Diferente do vike-solid, `Head` não é um componente que precisa de um
  // provider de contexto em volta: é uma função que RECEBE o `pageContext`.
  const value = isCallable(Head)
    ? (Head as (pageContext: PageContextServer) => Renderable)(pageContext)
    : (Head as Renderable);
  return renderToString(value);
}

function ensureArray<T>(a: T | T[] | undefined | null): T[] {
  if (typeof a === 'undefined' || a === null) return [];
  if (Array.isArray(a)) return a;
  return [a];
}

function getTagAttributes(pageContext: PageContextServer) {
  let lang = getHeadSetting<string | null>('lang', pageContext);
  // Don't set `lang` to its default value if it's `null` (so that users can set it to `null` in order to remove the default value)
  if (lang === undefined) lang = 'en';

  const bodyAttributes = mergeTagAttributesList(
    getHeadSetting<TagAttributes[]>('bodyAttributes', pageContext),
  );
  const htmlAttributes = mergeTagAttributesList(
    getHeadSetting<TagAttributes[]>('htmlAttributes', pageContext),
  );

  const bodyAttributesString = getTagAttributesString(bodyAttributes);
  const htmlAttributesString = getTagAttributesString({
    ...htmlAttributes,
    lang: lang ?? htmlAttributes.lang,
  });

  return { htmlAttributesString, bodyAttributesString };
}
function mergeTagAttributesList(tagAttributesList: TagAttributes[] = []) {
  const tagAttributes: TagAttributes = {};
  tagAttributesList.forEach((tagAttrs) => Object.assign(tagAttributes, tagAttrs));
  return tagAttributes;
}

export type Viewport = 'responsive' | number | null;
function getViewportTag(viewport: Viewport | undefined): string {
  if (viewport === 'responsive' || viewport === undefined) {
    // `user-scalable=no` isn't recommended anymore:
    //   - https://stackoverflow.com/questions/22354435/to-user-scalable-no-or-not-to-user-scalable-no/22544312#comment120949420_22544312
    return '<meta name="viewport" content="width=device-width,initial-scale=1">';
  }
  if (typeof viewport === 'number') {
    return `<meta name="viewport" content="width=${viewport}">`;
  }
  return '';
}

type StreamSetting = {
  type: 'web' | null;
  enable: boolean | null;
};
function resolveStreamSetting(pageContext: PageContextServer): StreamSetting {
  const { stream } = pageContext.config;
  const streamSetting: StreamSetting = {
    type: null,
    enable: null,
  };
  stream
    ?.slice()
    .reverse()
    .filter(isNotNullish)
    .forEach((setting) => {
      if (typeof setting === 'boolean') {
        streamSetting.enable = setting;
        return;
      }
      if (typeof setting === 'string') {
        streamSetting.type = setting;
        streamSetting.enable = true;
        return;
      }
      if (isObject(setting)) {
        const s = setting as { enable?: boolean | null; type?: 'web' };
        if (s.enable !== null) streamSetting.enable = s.enable ?? true;
        if (s.type !== undefined) streamSetting.type = s.type;
        return;
      }
      isType<never>(setting);
      throw new Error(`Unexpected +stream value ${String(setting)}`);
    });
  return streamSetting;
}
