import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';

import { DataTable, type Column } from './DataTable';

interface Row {
  id: string;
  name: string;
}
const cols: Column<Row>[] = [
  { header: 'Nome', sortKey: 'name', cell: (r) => <a href={`/x/${r.id}`}>{r.name}</a> },
  { header: 'Ações', align: 'end', cell: () => <span>—</span> },
];
const rows: Row[] = [
  { id: 'a', name: 'Alfa' },
  { id: 'b', name: 'Bravo' },
];

describe('DataTable', () => {
  it('renderiza linhas e link de detalhe', () => {
    const { getByRole } = render(() => (
      <DataTable columns={cols} rows={rows} rowKey={(r) => r.id} />
    ));
    expect(getByRole('link', { name: 'Alfa' })).toHaveAttribute('href', '/x/a');
  });

  it('gera link de ordenação com dir alternado', () => {
    const { getByRole } = render(() => (
      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.id}
        basePath="/x"
        sort="name"
        dir="asc"
      />
    ));
    expect(getByRole('link', { name: /Nome/ })).toHaveAttribute('href', '/x?sort=name&dir=desc');
  });
});
