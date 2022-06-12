/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Rule, Root } from "postcss";
import { State } from "../types";

export function bigSign(bigIntValue: any) {
  // @ts-ignore
  return (bigIntValue > 0n) - (bigIntValue < 0n);
}

export function remToPx(value: string, rootSize = 16): string | undefined {
  if (/^-?[0-9.]+rem$/.test(value)) {
    const number = parseFloat(value.substr(0, value.length - 3));
    if (!isNaN(number)) {
      return `${number * rootSize}px`;
    }
  }
  return undefined;
}

export function generateRules(state: State, classNames: string[]) {
  const rules: [bigint, Rule][] = state.modules.jit.generateRules
    .module(new Set(classNames), state.jitContext)
    .sort(([a]: any, [z]: any) => bigSign(a - z));

  const root = state.modules.postcss.module.root({
    nodes: rules.map(([, rule]) => rule),
  });
  state.modules.jit.expandApplyAtRules.module(state.jitContext)(root);

  const actualRules: Rule[] = [];
  root.walkRules((subRule: Rule) => {
    actualRules.push(subRule);
  });

  return {
    root,
    rules: actualRules,
  };
}

// TODO: settings = await state.editor.getConfiguration(uri)
export async function stringifyRoot(root: Root): Promise<string> {
  const tabSize = 2;
  const showPixelEquivalents = true;
  const rootFontSize = 16;

  const clone = root.clone();

  clone.walkAtRules("defaults", (node) => {
    node.remove();
  });

  if (showPixelEquivalents) {
    clone.walkDecls((decl) => {
      const px = remToPx(decl.value, rootFontSize);
      if (px) {
        decl.value = `${decl.value}/* ${px} */`;
      }
    });
  }

  return clone
    .toString()
    .replace(
      /([^;{}\s])(\n\s*})/g,
      (_match, before, after) => `${before};${after}`
    )
    .replace(/^(?: {4})+/gm, (indent: string) =>
      " ".repeat((indent.length / 4) * tabSize)
    );
}

export function stringifyRules(rules: Rule[], tabSize = 2): string {
  return (
    rules
      .map((rule) => rule.toString().replace(/([^}{;])$/gm, "$1;"))
      .join("\n\n")
      // eslint-disable-next-line no-regex-spaces
      .replace(/^(?:    )+/gm, (indent: string) =>
        " ".repeat((indent.length / 4) * tabSize)
      )
  );
}

export async function stringifyDecls(rule: Rule): Promise<string> {
  const showPixelEquivalents = true;
  const rootFontSize = 16;

  const result: string[] = [];
  rule.walkDecls(({ prop, value }) => {
    const px = showPixelEquivalents ? remToPx(value, rootFontSize) : undefined;
    result.push(`${prop}: ${value}${px ? `/* ${px} */` : ""};`);
  });
  return result.join(" ");
}
