export function getGlobalObject<T extends Record<string, unknown>>(
  // We use the filename as key; each `getGlobalObject()` call should live inside a file with a unique filename.
  key: `${string}.ts`,
  defaultValue: T,
): T {
  const holder = globalThis as unknown as Record<string, Record<string, T>>;
  const globalObjectsAll = (holder[projectKey] = holder[projectKey] ?? {});
  const globalObject = (globalObjectsAll[key] = globalObjectsAll[key] ?? defaultValue);
  return globalObject;
}
const projectKey = '_vike_lit';
