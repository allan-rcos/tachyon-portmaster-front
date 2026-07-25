import { fireEvent } from '@solidjs/testing-library';

// Inputs controlados do Solid perdem caracteres com `userEvent.type`
// (limitação da testing-lib; a digitação real funciona). Nos testes,
// setamos o valor completo num único evento `input`/`change`.
export function setInput(el: Element, value: string): void {
  fireEvent.input(el, { target: { value } });
}

export function setSelect(el: Element, value: string): void {
  fireEvent.change(el, { target: { value } });
}

/** Stub de window.location para capturar redirects/reloads em jsdom. */
export function stubLocation(search = ''): {
  hrefs: string[];
  reloads: () => number;
  restore: () => void;
} {
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
