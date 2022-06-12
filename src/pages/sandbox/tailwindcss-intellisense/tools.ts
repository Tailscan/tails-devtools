export type colorOpacity = {
  opacityVariable?: string;
  opacityValue?: string;
};
export type colorCallback = (colorOpacity: colorOpacity) => string;
export type colorObject = {
  [key: string]: string | colorCallback | colorObject;
};

export function flatColors(
  colors: colorObject,
  head?: string
): { [key: string]: string | colorCallback } {
  let flatten: { [key: string]: string | colorCallback } = {};
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === "string" || typeof value === "function") {
      flatten[
        head && key === "DEFAULT" ? head : head ? `${head}-${key}` : key
      ] = value;
    } else {
      flatten = {
        ...flatten,
        ...flatColors(value, head ? `${head}-${key}` : key),
      };
    }
  }
  return flatten;
}

export function getNestedValue(obj: { [key: string]: any }, key: string): any {
  const topKey = key.match(/^[^.[]+/);
  if (!topKey) return;
  let topValue = obj[topKey[0]];
  if (!topValue) return;
  let index = topKey[0].length;
  while (index < key.length) {
    const square = key.slice(index).match(/\[[^\s\]]+?\]/);
    const dot = key.slice(index).match(/\.[^.[]+$|\.[^.[]+(?=\.)/);
    if (
      (!square && !dot) ||
      (square?.index === undefined && dot?.index === undefined)
    )
      return topValue;
    if (typeof topValue !== "object") return;
    if (
      dot &&
      dot.index !== undefined &&
      (square?.index === undefined || dot.index < square.index)
    ) {
      const arg = dot[0].slice(1);
      topValue = topValue[arg];
      index += dot.index + dot[0].length;
    } else if (square && square.index !== undefined) {
      const arg = square[0]
        .slice(1, -1)
        .trim()
        .replace(/^['"]+|['"]+$/g, "");
      topValue = topValue[arg];
      index += square.index + square[0].length;
    }
  }
  return topValue;
}
