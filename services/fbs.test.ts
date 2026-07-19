import * as flatbuffers from 'flatbuffers';
import { describe, it, expect } from 'vitest';

import { enc, dec } from './fbs';

import { RoleResponseT } from '@/services/gen/fbs/api/fbs/account/role-response';
import { RoleListResponseT } from '@/services/gen/fbs/api/fbs/admin/role-list-response';
import { CargoManifestItemT } from '@/services/gen/fbs/api/fbs/container/cargo-manifest-item';
import { ContainerResponseT } from '@/services/gen/fbs/api/fbs/container/container-response';
import { ContainerSummaryListResponseT } from '@/services/gen/fbs/api/fbs/container/container-summary-list-response';
import { ContainerSummaryResponseT } from '@/services/gen/fbs/api/fbs/container/container-summary-response';
import { TelemetryLogItemT } from '@/services/gen/fbs/api/fbs/container/telemetry-log-item';
import { ProductCreateRequest } from '@/services/gen/fbs/api/fbs/product/product-create-request';

function pack(t: { pack(b: flatbuffers.Builder): number }): Uint8Array {
  const b = new flatbuffers.Builder(256);
  b.finish(t.pack(b));
  return b.asUint8Array();
}

describe('fbs bridge', () => {
  it('encode: risk_class string → índice numérico', () => {
    const bytes = enc.productCreate({
      name: 'Diesel',
      density: 0.84,
      risk_class: 'Class3FlammableLiquids',
    });
    const r = ProductCreateRequest.getRootAsProductCreateRequest(new flatbuffers.ByteBuffer(bytes));
    expect(r.name()).toBe('Diesel');
    expect(r.density()).toBeCloseTo(0.84);
    expect(r.riskClass()).toBe(2); // Class3FlammableLiquids = 2
  });

  it('decode: ContainerResponse → status string + snake_case + id string', () => {
    const bytes = pack(new ContainerResponseT('ctr_1', 'MSKU-1', 120, 300, 1 /* Loading */));
    const c = dec.container(bytes);
    expect(c).toEqual({
      id: 'ctr_1',
      code: 'MSKU-1',
      current_weight: 120,
      max_capacity: 300,
      status: 'Loading',
    });
  });

  it('decode: RoleList → paginação + permissions (enum list) por nome', () => {
    const role = new RoleResponseT('rol_1', 'Auditor', 3, [0, 4]); // ProductRead, ContainerRead
    const bytes = pack(new RoleListResponseT([role], 'next42', 1));
    const list = dec.roleList(bytes);
    expect(list.total).toBe(1);
    expect(list.next_cursor).toBe('next42');
    expect(list.data[0]).toEqual({
      id: 'rol_1',
      name: 'Auditor',
      user_count: 3,
      permissions: ['ProductRead', 'ContainerRead'],
    });
  });

  it('decode: ContainerSummaryList → aninhamento profundo + enums', () => {
    const summary = new ContainerSummaryResponseT(
      new ContainerResponseT('ctr_9', 'HLXU-9', 500, 1000, 2 /* Sealed */),
      [new CargoManifestItemT('prd_x', 'Soja', 10, 5.8)],
      [new TelemetryLogItemT('log_1', 3 /* Seal */, 'Lacrado', '2026-07-01T00:00:00Z')],
    );
    const bytes = pack(new ContainerSummaryListResponseT([summary], undefined, 1));
    const list = dec.containerSummaryList(bytes);
    expect(list.data[0].container.status).toBe('Sealed');
    expect(list.data[0].manifest[0]).toEqual({
      product_id: 'prd_x',
      product_name: 'Soja',
      quantity: 10,
      weight: 5.8,
    });
    expect(list.data[0].recent_logs[0].event).toBe('Seal');
    expect(list.data[0].recent_logs[0].id).toBe('log_1');
  });
});
