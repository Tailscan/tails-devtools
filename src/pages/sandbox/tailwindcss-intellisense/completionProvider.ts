import * as culori from "culori";
import dlv from "dlv";

import { getVariantsFromClassName } from "./getVariantsFromClassName";
import { State } from "./types";
import { getColor } from "./utils/color";
import isObject from "./utils/isObject";
import { naturalExpand } from "./utils/naturalExpand";
import * as jit from "./utils/jit";
import { Screen, stringifyScreen } from "./utils/screens";

const isUtil = (className: any) =>
  Array.isArray(className.__info)
    ? className.__info.some((x: any) => x.__source === "utilities")
    : className.__info.__source === "utilities";

type CompletionItem = any;

export function completionsFromClassList(
  state: State,
  classList: string,
  filter?: (item: CompletionItem) => boolean
) {
  const classNames = classList.split(/[\s+]/);
  const partialClassName = classNames[classNames.length - 1];
  const sep = state.separator;

  if (state.jit) {
    if (partialClassName.includes("/")) {
      // opacity modifiers
      const beforeSlash = partialClassName.split("/").slice(0, -1).join("/");
      const testClass = beforeSlash + "/[0]";
      const { rules } = jit.generateRules(state, [testClass]);
      if (rules.length > 0) {
        let opacities = dlv(state.config, "theme.opacity", {});
        if (!isObject(opacities)) {
          opacities = {};
        }
        return {
          isIncomplete: false,
          items: Object.keys(opacities).map((opacity, index) => {
            const className = `${beforeSlash}/${opacity}`;
            let kind = 21;
            let documentation = "";

            const color = getColor(state, className);
            if (color !== null) {
              kind = 16;
              if (typeof color !== "string" && (color.alpha ?? 1) !== 0) {
                documentation = culori.formatRgb(color);
              }
            }

            return {
              label: className,
              documentation,
              kind,
              sortText: naturalExpand(index),
              data: [className],
              textEdit: {
                newText: className,
              },
            };
          }),
        };
      }
    }

    const allVariants = Object.keys(state.variants);
    const { variants: existingVariants, offset } = getVariantsFromClassName(
      state,
      partialClassName
    );

    const important = partialClassName.substr(offset).startsWith("!");

    const items: CompletionItem[] = [];

    if (!important) {
      const shouldSortVariants = !true;

      items.push(
        ...Object.entries(state.variants)
          .filter(([variant]) => !existingVariants.includes(variant))
          .map(([variant, definition], index) => {
            let resultingVariants = [...existingVariants, variant];

            if (shouldSortVariants) {
              resultingVariants = resultingVariants.sort(
                (a, b) => allVariants.indexOf(b) - allVariants.indexOf(a)
              );
            }

            return {
              label: variant + sep,
              kind: 9,
              detail: definition,
              data: "variant",
              command: {
                title: "",
                command: "editor.action.triggerSuggest",
              },
              sortText: "-" + naturalExpand(index),
              textEdit: {
                newText: resultingVariants[resultingVariants.length - 1] + sep,
              },
              additionalTextEdits:
                shouldSortVariants && resultingVariants.length > 1
                  ? [
                      {
                        newText:
                          resultingVariants
                            .slice(0, resultingVariants.length - 1)
                            .join(sep) + sep,
                      },
                    ]
                  : [],
            } as CompletionItem;
          })
      );
    }

    if (state.classList) {
      return {
        isIncomplete: false,
        items: items.concat(
          state.classList.map(([className, { color }], index) => {
            const kind = color ? 16 : 21;
            let documentation = null;

            if (color && typeof color !== "string") {
              documentation = culori.formatRgb(color);
            }

            return {
              label: className,
              kind,
              documentation,
              sortText: naturalExpand(index),
              data: [
                ...existingVariants,
                important ? `!${className}` : className,
              ],
              textEdit: {
                newText: className,
              },
            } as CompletionItem;
          })
        ),
      };
    }

    return {
      isIncomplete: false,
      items: items
        .concat(
          Object.keys(state.classNames.classNames)
            .filter((className) => {
              const item = state.classNames.classNames[className];
              if (existingVariants.length === 0) {
                return item.__info;
              }
              return item.__info && isUtil(item);
            })
            .map((className, index) => {
              let kind = 21;
              let documentation = "";

              const color = getColor(state, className);
              if (color !== null) {
                kind = 16;
                if (typeof color !== "string" && (color.alpha ?? 1) !== 0) {
                  documentation = culori.formatRgb(color);
                }
              }

              return {
                label: className,
                kind,
                documentation,
                sortText: naturalExpand(index),
                data: [
                  ...existingVariants,
                  important ? `!${className}` : className,
                ],
                textEdit: {
                  newText: className,
                },
              } as CompletionItem;
            })
        )
        .filter((item) => {
          if (item === null) {
            return false;
          }
          if (filter && !filter(item)) {
            return false;
          }
          return true;
        }),
    };
  }

  return {
    isIncomplete: false,
    items: [],
  };
}

export async function resolveCompletionItem(
  state: State,
  item: CompletionItem
): Promise<CompletionItem> {
  if (
    ["helper", "directive", "variant", "layer", "@tailwind"].includes(item.data)
  ) {
    return item;
  }

  if (item.data === "screen") {
    let screens = dlv(
      state.config,
      ["theme", "screens"],
      dlv(state.config, ["screens"], {})
    );
    if (!isObject(screens)) screens = {};
    item.detail = stringifyScreen(screens[item.label] as Screen);
    return item;
  }

  if (!Array.isArray(item.data)) {
    return item;
  }

  if (state.jit) {
    if (item.kind === 9) return item;
    if (item.detail && item.documentation) return item;
    const { root, rules } = jit.generateRules(state, [
      item.data.join(state.separator),
    ]);
    if (rules.length === 0) return item;
    if (!item.detail) {
      if (rules.length === 1) {
        item.detail = await jit.stringifyDecls(rules[0]);
      } else {
        item.detail = `${rules.length} rules`;
      }
    }
    if (!item.documentation) {
      item.documentation = await jit.stringifyRoot(root);
    }
    return item;
  }

  return item;
}
