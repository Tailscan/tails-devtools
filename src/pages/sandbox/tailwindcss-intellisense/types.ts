import { createState } from "./state";
import { getColor } from "./utils/color";
import { getVariants } from "./utils/getVariants";

type Color = ReturnType<typeof getColor>;

export type State = ReturnType<typeof createState> & {
  classList: [string, { color: Color }][];
  variants: ReturnType<typeof getVariants>;
  screens: string[];
  classNames: {
    classNames: Record<string, any>;
    context: Record<string, any>;
  };
};
