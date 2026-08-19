import { describe, expect, it } from 'vitest';

import {
  containerStatusLabels,
  permissionLabel,
  permissionOptionGroups,
  riskClassLabels,
  riskClassOptions,
  telemetryEventLabels,
} from './labels';

describe('rótulos de domínio seguem o locale', () => {
  it('status de contêiner', () => {
    expect(containerStatusLabels('pt-BR').Loading).toBe('Carregando');
    expect(containerStatusLabels('en').Loading).toBe('Loading');
    expect(containerStatusLabels('es').Loading).toBe('Cargando');
  });

  it('classe de risco IMDG', () => {
    expect(riskClassLabels('pt-BR').Class3FlammableLiquids).toContain('inflamáveis');
    expect(riskClassLabels('en').Class3FlammableLiquids).toContain('Flammable');
    expect(riskClassLabels('es').Class3FlammableLiquids).toContain('inflamables');
  });

  it('evento de telemetria', () => {
    expect(telemetryEventLabels('pt-BR').unload).toBe('Descarga');
    expect(telemetryEventLabels('en').unload).toBe('Unload');
  });

  it('permissão', () => {
    expect(permissionLabel('container:seal', 'pt-BR')).toBe('Lacrar contêineres');
    expect(permissionLabel('container:seal', 'en')).toBe('Seal containers');
  });
});

describe('permissionLabel — slug desconhecido', () => {
  it('devolve o slug cru em vez de sumir com a caixa', () => {
    expect(permissionLabel('relatorio:exportar', 'pt-BR')).toBe('relatorio:exportar');
  });
});

describe('riskClassOptions', () => {
  it('cobre o enum inteiro e traduz os rótulos', () => {
    const pt = riskClassOptions('pt-BR');
    const en = riskClassOptions('en');
    expect(pt).toHaveLength(10);
    expect(pt.map((o) => o.value)).toEqual(en.map((o) => o.value));
    expect(pt.at(0)?.label).not.toBe(en.at(0)?.label);
  });
});

describe('permissionOptionGroups', () => {
  it('agrupa pelo prefixo do slug e traduz grupo e item', () => {
    const groups = permissionOptionGroups(['container:seal', 'product:read'], 'en');
    expect(groups.map((g) => g.label)).toEqual(['Products', 'Containers']);
    expect(groups.at(1)?.options.at(0)?.label).toBe('Seal containers');
  });

  it('um recurso que o front não conhece cai num grupo com o próprio prefixo', () => {
    const groups = permissionOptionGroups(['relatorio:exportar'], 'pt-BR');
    expect(groups).toHaveLength(1);
    expect(groups.at(0)?.label).toBe('relatorio');
  });
});
