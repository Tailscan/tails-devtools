export function dedupe<T>(arr: Array<T>): Array<T> {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
}

export function dedupeBy<T>(
  arr: Array<T>,
  transform: (item: T) => any
): Array<T> {
  return arr.filter(
    (value, index, self) =>
      self.map(transform).indexOf(transform(value)) === index
  );
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function flatten<T>(arrays: T[][]): T[] {
  // eslint-disable-next-line prefer-spread
  return [].concat.apply([], arrays as any);
}

export function equal(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  const aSorted = a.concat().sort();
  const bSorted = b.concat().sort();

  for (let i = 0; i < aSorted.length; ++i) {
    if (aSorted[i] !== bSorted[i]) return false;
  }

  return true;
}

export function equalExact(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}
