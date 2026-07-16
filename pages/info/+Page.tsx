import { useData } from 'vike-solid/useData';
import type { DataProps } from './+data';
import './Page.scss';

// Componente SolidJS: os dados injetados pelo Vike SSR (hook `data`)
// são acessados via `useData` — equivalente ao `$props().data` do Svelte.
export default function Page() {
  const data = useData<DataProps>();

  return (
    <main class="info-page">
      <header class="info-header">
        <h1>Informações do Sistema</h1>
        <p>Diagnóstico de runtime e telemetria de infraestrutura ativa.</p>
      </header>

      <div class="info-grid">
        <section class="info-card frontend-card">
          <div class="card-header">
            <h2>{data.frontend.name}</h2>
            <span class="runtime-badge">{data.frontend.runtime}</span>
          </div>

          <table class="info-table">
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Versão</td>
                <td><code>{data.frontend.version}</code></td>
              </tr>
              <tr>
                <td>Ambiente</td>
                <td>{data.frontend.environment}</td>
              </tr>
              <tr>
                <td>Uso de Memória</td>
                <td class="highlight-metric">{data.frontend.memory_usage_mb} MB</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="info-card backend-placeholder">
          <div class="placeholder-content">
            <h3>[ Backend API (Rust) ]</h3>
            <p>Aguardando integração com ConnectRPC</p>
          </div>
        </section>
      </div>
    </main>
  );
}