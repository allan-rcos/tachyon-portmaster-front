export function isCallable<T extends (...args: never[]) => unknown>(
  thing: T | unknown,
): thing is T {
  return thing instanceof Function || typeof thing === 'function';
}
