// ============================================================
//  Ponte JSON(DTO) ↔ FlatBuffers. Escrita à mão sobre as classes
//  geradas pelo flatc (services/gen/fbs, object API). Só é usada no
//  wire FlatBuffers (produção); em dev/testes o wire é JSON e esta
//  ponte não é exercida no transporte.
//
//  Diferenças tratadas:
//   • nomes de campo: snake_case (DTO) ↔ camelCase (classes *T)
//   • enums: string do domínio (DTO) ↔ índice numérico (FBS) — os
//     arrays em gen/flow/v1/common.ts estão na MESMA ordem do enum FBS.
//   • ids continuam string dos dois lados (schemas .fbs ajustados).
//
//  Encode (requests): tipos são planos → construção explícita do *T.
//  Decode (responses): reflexão genérica (recursiva) sobre o objeto
//  desempacotado, com enums resolvidos por nome de campo.
// ============================================================
import * as flatbuffers from 'flatbuffers';

// Classes geradas (object API)
import { AccountPasswordChangeRequestT } from '@/services/gen/fbs/api/fbs/account/account-password-change-request';
import { AccountProfileResponse as FbAccountProfileResponse } from '@/services/gen/fbs/api/fbs/account/account-profile-response';
import { AccountUpdateRequestT } from '@/services/gen/fbs/api/fbs/account/account-update-request';
import { RoleResponse as FbRoleResponse } from '@/services/gen/fbs/api/fbs/account/role-response';
import { RoleCreateRequestT } from '@/services/gen/fbs/api/fbs/admin/role-create-request';
import { RoleListResponse as FbRoleListResponse } from '@/services/gen/fbs/api/fbs/admin/role-list-response';
import { UserAdminPasswordResetRequestT } from '@/services/gen/fbs/api/fbs/admin/user-admin-password-reset-request';
import { UserAdminResponse as FbUserAdminResponse } from '@/services/gen/fbs/api/fbs/admin/user-admin-response';
import { UserCreateRequestT } from '@/services/gen/fbs/api/fbs/admin/user-create-request';
import { UserUpdateRequestT } from '@/services/gen/fbs/api/fbs/admin/user-update-request';
import { LoginRequestT } from '@/services/gen/fbs/api/fbs/auth/login-request';
import { LoginResponse as FbLoginResponse } from '@/services/gen/fbs/api/fbs/auth/login-response';
import { ContainerCreateRequestT } from '@/services/gen/fbs/api/fbs/container/container-create-request';
import { ContainerListResponse as FbContainerListResponse } from '@/services/gen/fbs/api/fbs/container/container-list-response';
import { ContainerResponse as FbContainerResponse } from '@/services/gen/fbs/api/fbs/container/container-response';
import { ContainerSummaryListResponse as FbContainerSummaryListResponse } from '@/services/gen/fbs/api/fbs/container/container-summary-list-response';
import { ContainerUpdateRequestT } from '@/services/gen/fbs/api/fbs/container/container-update-request';
import { LoadItemRequestT } from '@/services/gen/fbs/api/fbs/manifest/load-item-request';
import { ManifestResponse as FbManifestResponse } from '@/services/gen/fbs/api/fbs/manifest/manifest-response';
import { UnloadItemRequestT } from '@/services/gen/fbs/api/fbs/manifest/unload-item-request';
import { MetricsResponse as FbMetricsResponse } from '@/services/gen/fbs/api/fbs/metrics/metrics-response';
import { ProductCreateRequestT } from '@/services/gen/fbs/api/fbs/product/product-create-request';
import { ProductListResponse as FbProductListResponse } from '@/services/gen/fbs/api/fbs/product/product-list-response';
import { ProductResponse as FbProductResponse } from '@/services/gen/fbs/api/fbs/product/product-response';
import { ProductUpdateRequestT } from '@/services/gen/fbs/api/fbs/product/product-update-request';
import type {
  AccountProfile,
  AccountPasswordChangeRequest,
  AccountUpdateRequest,
} from '@/services/gen/flow/v1/account';
import type {
  Role,
  RoleCreateRequest,
  RoleList,
  UserAdmin,
  UserCreateRequest,
  UserUpdateRequest,
  UserAdminPasswordResetRequest,
} from '@/services/gen/flow/v1/admin';
import type { LoginRequest, LoginResponse } from '@/services/gen/flow/v1/auth';
import {
  CONTAINER_STATUS,
  PERMISSION,
  RISK_CLASS,
  TELEMETRY_EVENT,
  type Permission,
  type RiskClass,
} from '@/services/gen/flow/v1/common';
import type {
  Container,
  ContainerCreateRequest,
  ContainerSummaryList,
  ContainerUpdateRequest,
  ContainerList,
} from '@/services/gen/flow/v1/container';
import type { Metrics } from '@/services/gen/flow/v1/metrics';
import type {
  Product,
  ProductCreateRequest,
  ProductList,
  ProductUpdateRequest,
} from '@/services/gen/flow/v1/product';

export type FbsEncode<T> = (value: T) => Uint8Array;
export type FbsDecode<T> = (bytes: Uint8Array) => T;

// ---- helpers de transporte ---------------------------------
function toBytes(t: { pack(b: flatbuffers.Builder): number }): Uint8Array {
  const b = new flatbuffers.Builder(256);
  b.finish(t.pack(b));
  return b.asUint8Array();
}

function buf(bytes: Uint8Array): flatbuffers.ByteBuffer {
  return new flatbuffers.ByteBuffer(bytes);
}

// ---- decode genérico (objeto *T → DTO snake_case) ----------
// Enums resolvidos por nome de campo (camelCase da classe *T).
const ENUM_BY_FIELD: Record<string, readonly string[]> = {
  status: CONTAINER_STATUS,
  riskClass: RISK_CLASS,
  event: TELEMETRY_EVENT,
};
const ENUM_LIST_BY_FIELD: Record<string, readonly string[]> = {
  permissions: PERMISSION,
};

function camelToSnake(k: string): string {
  return k.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromT(value: any): any {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value.map(fromT);
  if (typeof value !== 'object') return value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, any> = {};
  for (const key of Object.keys(value)) {
    const val = value[key];
    const snake = camelToSnake(key);
    if (key in ENUM_BY_FIELD && typeof val === 'number') {
      out[snake] = ENUM_BY_FIELD[key][val];
    } else if (key in ENUM_LIST_BY_FIELD && Array.isArray(val)) {
      out[snake] = val.map((n: number) => ENUM_LIST_BY_FIELD[key][n]);
    } else if (Array.isArray(val)) {
      out[snake] = val.map(fromT);
    } else if (val !== null && typeof val === 'object') {
      out[snake] = fromT(val);
    } else if (val !== null) {
      out[snake] = val;
    }
  }
  return out;
}

// ---- enum encode (string → índice) -------------------------
const risk = (s: RiskClass): number => RISK_CLASS.indexOf(s);
const perms = (ps: Permission[]): number[] => ps.map((p) => PERMISSION.indexOf(p));

// ---- Encoders (request bodies, planos) ---------------------
export const enc = {
  login: ((v: LoginRequest) =>
    toBytes(new LoginRequestT(v.email, v.password))) as FbsEncode<LoginRequest>,

  accountUpdate: ((v: AccountUpdateRequest) =>
    toBytes(new AccountUpdateRequestT(v.name, v.email))) as FbsEncode<AccountUpdateRequest>,
  accountPassword: ((v: AccountPasswordChangeRequest) =>
    toBytes(
      new AccountPasswordChangeRequestT(v.current_password, v.new_password),
    )) as FbsEncode<AccountPasswordChangeRequest>,

  userCreate: ((v: UserCreateRequest) =>
    toBytes(
      new UserCreateRequestT(v.name, v.email, v.initial_password, v.role_ids),
    )) as FbsEncode<UserCreateRequest>,
  userUpdate: ((v: UserUpdateRequest) =>
    toBytes(new UserUpdateRequestT(v.name, v.email))) as FbsEncode<UserUpdateRequest>,
  userResetPassword: ((v: UserAdminPasswordResetRequest) =>
    toBytes(
      new UserAdminPasswordResetRequestT(v.new_password),
    )) as FbsEncode<UserAdminPasswordResetRequest>,

  roleCreate: ((v: RoleCreateRequest) =>
    toBytes(new RoleCreateRequestT(v.name, perms(v.permissions)))) as FbsEncode<RoleCreateRequest>,

  productCreate: ((v: ProductCreateRequest) =>
    toBytes(
      new ProductCreateRequestT(v.name, v.density, risk(v.risk_class)),
    )) as FbsEncode<ProductCreateRequest>,
  productUpdate: ((v: ProductUpdateRequest) =>
    toBytes(
      new ProductUpdateRequestT(v.name, v.density, risk(v.risk_class)),
    )) as FbsEncode<ProductUpdateRequest>,

  containerCreate: ((v: ContainerCreateRequest) =>
    toBytes(
      new ContainerCreateRequestT(v.code, v.max_capacity),
    )) as FbsEncode<ContainerCreateRequest>,
  containerUpdate: ((v: ContainerUpdateRequest) =>
    toBytes(new ContainerUpdateRequestT(v.max_capacity))) as FbsEncode<ContainerUpdateRequest>,

  loadItem: ((v: { container_id: string; product_id: string; quantity: number }) =>
    toBytes(new LoadItemRequestT(v.container_id, v.product_id, v.quantity))) as FbsEncode<{
    container_id: string;
    product_id: string;
    quantity: number;
  }>,
  unloadItem: ((v: { container_id: string; product_id: string; quantity: number }) =>
    toBytes(new UnloadItemRequestT(v.container_id, v.product_id, v.quantity))) as FbsEncode<{
    container_id: string;
    product_id: string;
    quantity: number;
  }>,
};

// ---- Decoders (responses) ----------------------------------
export const dec = {
  loginResponse: ((b) =>
    fromT(FbLoginResponse.getRootAsLoginResponse(buf(b)).unpack())) as FbsDecode<LoginResponse>,

  accountProfile: ((b) =>
    fromT(
      FbAccountProfileResponse.getRootAsAccountProfileResponse(buf(b)).unpack(),
    )) as FbsDecode<AccountProfile>,

  userAdmin: ((b) =>
    fromT(FbUserAdminResponse.getRootAsUserAdminResponse(buf(b)).unpack())) as FbsDecode<UserAdmin>,

  role: ((b) => fromT(FbRoleResponse.getRootAsRoleResponse(buf(b)).unpack())) as FbsDecode<Role>,
  roleList: ((b) =>
    fromT(FbRoleListResponse.getRootAsRoleListResponse(buf(b)).unpack())) as FbsDecode<RoleList>,

  product: ((b) =>
    fromT(FbProductResponse.getRootAsProductResponse(buf(b)).unpack())) as FbsDecode<Product>,
  productList: ((b) =>
    fromT(
      FbProductListResponse.getRootAsProductListResponse(buf(b)).unpack(),
    )) as FbsDecode<ProductList>,

  container: ((b) =>
    fromT(FbContainerResponse.getRootAsContainerResponse(buf(b)).unpack())) as FbsDecode<Container>,
  containerList: ((b) =>
    fromT(
      FbContainerListResponse.getRootAsContainerListResponse(buf(b)).unpack(),
    )) as FbsDecode<ContainerList>,
  containerSummaryList: ((b) =>
    fromT(
      FbContainerSummaryListResponse.getRootAsContainerSummaryListResponse(buf(b)).unpack(),
    )) as FbsDecode<ContainerSummaryList>,

  manifestResult: ((b) =>
    fromT(FbManifestResponse.getRootAsManifestResponse(buf(b)).unpack())) as FbsDecode<{
    message: string;
    container: Container;
  }>,

  metrics: ((b) =>
    fromT(FbMetricsResponse.getRootAsMetricsResponse(buf(b)).unpack())) as FbsDecode<Metrics>,
};
