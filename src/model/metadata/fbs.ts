import { buf, fromT } from '@model/core/fbs-runtime';

import type { PermissionList } from './dto';

import { PermissionListResponse as FbPermissionListResponse } from '@/fbs/api/fbs/metadata/permission-list-response';

export const decPermissionList = (b: Uint8Array): PermissionList =>
  fromT(
    FbPermissionListResponse.getRootAsPermissionListResponse(buf(b)).unpack(),
  ) as PermissionList;
