import { buf, fromT } from '@model/core/fbs-runtime';

import type { ProjectInfo } from './dto';

import { ProjectInfo as FbProjectInfo } from '@/fbs/api/fbs/server/project-info';

export const decProjectInfo = (b: Uint8Array): ProjectInfo =>
  fromT(FbProjectInfo.getRootAsProjectInfo(buf(b)).unpack()) as ProjectInfo;
