import { ClassItem, ClassList } from "@panel/hooks";

export type NormalizedClass = ClassItem & {
  normalized: string;
};

export type NormalizedClassList = NormalizedClass[];

export type Data = Record<string, NormalizedClassList>;

const IMPORTANT_MODIFIER = "!";
// Regex is needed, so we don't match against colons in labels for arbitrary values like `text-[color:var(--mystery-var)]`
// I'd prefer to use a negative lookbehind for all supported labels, but lookbehinds don't have good browser support yet. More info: https://caniuse.com/js-regexp-lookbehind
const MODIFIER_SEPARATOR_REGEX = /:(?![^[]*\])/;
const MODIFIER_SEPARATOR = ":";

export const normalize = (classNames: ClassList): Data => {
  const classList: Data = {};

  classNames.forEach((item) => {
    const originalClassName = item.className;
    const modifiers = originalClassName.split(MODIFIER_SEPARATOR_REGEX);
    const classNameWithImportantModifier = modifiers.pop()!;

    const hasImportantModifier =
      classNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const className = hasImportantModifier
      ? classNameWithImportantModifier.substring(1)
      : classNameWithImportantModifier;

    const variantModifier =
      modifiers.length === 0
        ? ""
        : modifiers.sort().concat("").join(MODIFIER_SEPARATOR);

    const fullModifier = hasImportantModifier
      ? variantModifier + IMPORTANT_MODIFIER
      : variantModifier;

    const data = {
      ...item,
      normalized: className,
    };

    const prefix = fullModifier ? fullModifier : "DEFAULT";
    classList[prefix] = [...(classList[prefix] || []), data];
  });

  return classList;
};
