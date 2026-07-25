import type { SystemInfo } from '@viewmodel/system/system-info-page.vm';
import type { JSX } from 'solid-js';


// Folha global (não é CSS Module): as classes desta tela são nomes globais,
// usados como strings no JSX abaixo. Mantida assim de propósito — convertê-la
// em módulo trocaria os nomes por hashes e a tela perderia o estilo.
import '../styles/info-page.scss';

/**
 * Painel de diagnóstico de runtime da rota /info.
 *
 * @param props.frontend Telemetria do processo que serviu o SSR.
 */
export function SystemInfoPanel(props: { frontend: SystemInfo }): JSX.Element {
  return (
    <main class="info-page">
      <header class="info-header">
        <h1>Informações do Sistema</h1>
        <p>Diagnóstico de runtime e telemetria de infraestrutura ativa.</p>
      </header>

      <div class="info-grid">
        <section class="info-card frontend-card">
          <div class="card-header">
            <h2>{props.frontend.name}</h2>
            <span class="runtime-badge">{props.frontend.runtime}</span>
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
                <td>
                  <code>{props.frontend.version}</code>
                </td>
              </tr>
              <tr>
                <td>Ambiente</td>
                <td>{props.frontend.environment}</td>
              </tr>
              <tr>
                <td>Uso de Memória</td>
                <td class="highlight-metric">{props.frontend.memory_usage_mb} MB</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="info-card backend-placeholder">
          <div class="placeholder-content">
            <h2>[ Backend API (Rust) ]</h2>
            <p>Aguardando integração com ConnectRPC</p>
          </div>
        </section>
      </div>
    </main>
  );
}
