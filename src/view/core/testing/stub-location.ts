/**
 * Stub de `window.location` para capturar redirects e reloads no jsdom.
 *
 * Mora na View porque é a única camada que redireciona: o ViewModel sinaliza
 * a intenção (um erro de domínio, um href pronto) e quem toca o navegador é o
 * componente. Um helper de navegador não teria por que existir num diretório
 * neutro de testes.
 *
 * @packageDocumentation
 */
/** Controles do stub de `window.location` instalado no teste. */
export interface LocationStub {
  /** Hrefs atribuídos, na ordem — o último é o redirect efetivo. */
  hrefs: string[];
  /** Quantas vezes `location.reload()` foi chamado. */
  reloads: () => number;
  /** Devolve o `window.location` original. Chamar no `afterEach`. */
  restore: () => void;
}

/**
 * Substitui `window.location` por um duplo que registra em vez de navegar.
 *
 * @param search Query string que o código sob teste vai ler (ex.: `'?redirect=/painel'`).
 */
export function stubLocation(search = ''): LocationStub {
  const hrefs: string[] = [];
  let reloadCount = 0;
  const original = window.location;
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      search,
      reload: () => {
        reloadCount += 1;
      },
      get href() {
        return hrefs.at(-1) ?? '';
      },
      set href(v: string) {
        hrefs.push(v);
      },
    },
  });
  return {
    hrefs,
    reloads: () => reloadCount,
    restore: () =>
      Object.defineProperty(window, 'location', { configurable: true, value: original }),
  };
}
