export { assert };
export { assertWarning };

function assert(condition: unknown): asserts condition {
  if (condition) return;
  throw new Error('You stumbled upon a vike-lit bug, reach out to the PortMaster team.');
}

function assertWarning(condition: unknown, message: string) {
  if (condition) return;
  console.warn(new Error(message));
}
