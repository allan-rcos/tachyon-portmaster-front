export { getHeadSetting };

import type { PageContext } from 'vike/types';

import { configsCumulative } from '../hooks/useConfig/configsCumulative.js';
import type { ConfigFromHookResolved } from '../types/Config.js';
import type { PageContextInternal } from '../types/PageContext.js';
import { includes } from '../utils/includes.js';
import { isCallable } from '../utils/isCallable.js';

// We use loose typing instead of doing proper validation in order to save KBs sent to the client-side.

function getHeadSetting<T>(
  configName: keyof ConfigFromHookResolved,
  pageContext: PageContext & PageContextInternal,
): undefined | T {
  // Set by useConfig()
  const valFromUseConfig = pageContext._configFromHook?.[configName];
  // Set by +configName.js
  const valFromConfig = (pageContext.config as Record<string, unknown>)[configName];

  const getCallable = (val: unknown) =>
    isCallable(val) ? (val as (pageContext: PageContext) => unknown)(pageContext) : val;
  if (!includes(configsCumulative, configName)) {
    if (valFromUseConfig !== undefined) return valFromUseConfig as T;
    return getCallable(valFromConfig) as T;
  } else {
    return [
      //
      ...((valFromConfig as unknown[]) ?? []).map(getCallable),
      ...((valFromUseConfig as unknown[]) ?? []),
    ] as T;
  }
}
