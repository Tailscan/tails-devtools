import * as jit from "./utils/jit";
import { State } from "./types";

export async function provideClassNameHover(
  state: State,
  className: string | null
): Promise<string | null> {
  if (className === null) return null;

  const { root, rules } = jit.generateRules(state, [className]);

  if (rules.length === 0) {
    return null;
  }

  const css = await jit.stringifyRoot(root);
  return css;
}
