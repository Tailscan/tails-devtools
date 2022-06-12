import { State } from "../types";
import { combinations } from "./combinations";
import dlv from "dlv";

export function getClassNameParts(state: State, className: string): string[] {
  const separator = state.separator;
  className = className.replace(/^\./, "");
  const parts: string[] = className.split(separator);

  if (parts.length === 1) {
    return (
      dlv(state.classNames.classNames, [className, "__info", "__rule"]) ===
        true ||
      Array.isArray(dlv(state.classNames.classNames, [className, "__info"]))
        ? [className]
        : null
    ) as any;
  }

  const points = combinations("123456789".substr(0, parts.length - 1)).map(
    (x) => x.split("").map((x) => parseInt(x, 10))
  );

  const possibilities: string[][] = [
    [className],
    ...points.map((p) => {
      const result = [];
      let i = 0;
      p.forEach((x) => {
        result.push(parts.slice(i, x).join("-"));
        i = x;
      });
      result.push(parts.slice(i).join("-"));
      return result;
    }),
  ];

  return possibilities.find((key) => {
    if (
      dlv(state.classNames.classNames, [...key, "__info", "__rule"]) === true ||
      Array.isArray(dlv(state.classNames.classNames, [...key, "__info"]))
    ) {
      return true;
    }
    return false;
  }) as any;
}
