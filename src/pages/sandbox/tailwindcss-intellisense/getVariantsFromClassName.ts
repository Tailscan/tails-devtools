import { State } from "./types";

export function getVariantsFromClassName(
  state: State,
  className: string
): { variants: string[]; offset: number } {
  let str = className;
  const allVariants = Object.keys(state.variants);
  const allVariantsByLength = allVariants.sort((a, b) => b.length - a.length);
  const variants = new Set<string>();
  let offset = 0;

  while (str) {
    let found = false;
    for (const variant of allVariantsByLength) {
      if (str.startsWith(variant + state.separator)) {
        variants.add(variant);
        str = str.substr(variant.length + state.separator.length);
        offset += variant.length + state.separator.length;
        found = true;
        break;
      }
    }
    if (!found) str = "";
  }

  return { variants: Array.from(variants), offset };
}
