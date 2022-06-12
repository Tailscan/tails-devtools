import postcss from "postcss";
import postcssSelectorParser from "postcss-selector-parser";
import {
  generateRules,
  expandApplyAtRules,
  createContext,
  resolveConfig,
} from "vc.tailwindcss";
import { getColor } from "./utils/color";
import { getVariants } from "./utils/getVariants";
import isObject from "./utils/isObject";

export const createState = (userConfig = {}) => {
  try {
    const config = resolveConfig(userConfig);
    const state = {
      modules: {
        postcss: { module: postcss },
        postcssSelectorParser: { module: postcssSelectorParser },
        jit: {
          generateRules: {
            module: generateRules,
          },
          expandApplyAtRules: {
            module: expandApplyAtRules,
          },
        },
      },
      config,
      jitContext: createContext(config),
      enabled: true,
      classNames: {
        classNames: {},
        context: {},
      },
      jit: true,
      separator: ":",
      version: "3.0.24",
    };

    state.classList = state.jitContext
      .getClassList()
      .filter((className) => className !== "*")
      .map((className) => {
        return [className, { color: getColor(state, className) }];
      });

    state.variants = getVariants(state);
    state.screens = isObject(state.config.theme.screens)
      ? Object.keys(state.config.theme.screens)
      : [];

    return state;
  } catch (e) {
    console.log(e);
  }
};
