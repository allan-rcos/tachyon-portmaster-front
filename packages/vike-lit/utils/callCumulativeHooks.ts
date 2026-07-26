import { providePageContext } from 'vike/getPageContext';
import type { PageContext } from 'vike/types';

import { isCallable } from './isCallable.js';

export async function callCumulativeHooks(
  values: undefined | unknown[],
  pageContext: PageContext,
): Promise<unknown[]> {
  if (!values) return [];
  const valuesPromises = values.map((val) => {
    if (isCallable(val)) {
      providePageContext(pageContext);
      // Hook
      return (val as (pageContext: PageContext) => unknown)(pageContext);
    } else {
      // Plain value
      return val;
    }
  });
  const valuesResolved = await Promise.all(valuesPromises);
  return valuesResolved;
}
