import { createSystemInfoPageInput } from '@viewmodel/system/system-info-page.vm';
import type { PageContext } from 'vike/types';

import { toPageInput } from '@/pages/pageInput';

export { data };

async function data(pageContext: PageContext) {
  return toPageInput(pageContext, (request) => Promise.resolve(createSystemInfoPageInput(request)));
}
