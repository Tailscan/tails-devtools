const triggerCharacters = ['"', " ", ":", "!"];

const reservedRegexChars = [
  ".",
  "^",
  "$",
  "*",
  "+",
  "-",
  "?",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "\\",
  "|",
];

const escapeRegex = (text: string) =>
  [...text]
    .map((character) =>
      reservedRegexChars.includes(character) ? `\\${character}` : character
    )
    .join("");

const createRegExp = (trigger: string[]) => {
  // negative lookahead to match only the trigger + the actual token = "bladhwd:adawd:word test" => ":word"
  // https://stackoverflow.com/a/8057827/2719917
  const tokenRegExp = new RegExp(
    `(${trigger
      // the sort is important for multi-char combos as "/kick", "/"
      .sort((a, b) => {
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        return 0;
      })
      .map((a) => escapeRegex(a))
      .join("|")})((?:(?!\\1)[^\\s])*$)`
  );

  const tokenRegExpEnding = new RegExp(
    `(${trigger
      // the sort is important for multi-char combos as "/kick", "/"
      .sort((a, b) => {
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        return 0;
      })
      .map((a) => escapeRegex(a))
      .join("|")})$`
  );

  return {
    tokenRegExp,
    tokenRegExpEnding,
  };
};

export const getMatches = (_beforeCursor: string) => {
  let matches = null;
  const beforeCursor = `"${_beforeCursor}`;
  for (const character of triggerCharacters) {
    const { tokenRegExp } = createRegExp([character]);
    if (tokenRegExp.exec(beforeCursor)) {
      matches = tokenRegExp.exec(beforeCursor);
    }
  }

  return matches;
};

const MAIN = /\$&/g;
const PLACE = /\$(\d)/g;

export const replace = (
  result: string | null,
  beforeCursor: string,
  afterCursor: string
): [string, string] | void => {
  if (result === null) return;
  if (Array.isArray(result)) {
    afterCursor = result[1] + afterCursor;
    result = result[0];
  }
  const match = getMatches(beforeCursor);
  if (match == null || match.index == null) return;
  // remove first character
  match.index = match.index - 1;
  const replacement = (result || "")
    .replace(MAIN, match[0])
    .replace(PLACE, (_, p) => match[parseInt(p)]);
  return [
    [
      beforeCursor.slice(0, match.index + 1),
      replacement,
      beforeCursor.slice(match.index + match[0].length),
    ].join(""),
    afterCursor,
  ];
};
