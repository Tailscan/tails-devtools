export function findAll(re: RegExp, str: string): RegExpMatchArray[] {
  let match: RegExpMatchArray | null;
  const matches: RegExpMatchArray[] = [];
  while ((match = re.exec(str)) !== null) {
    matches.push({ ...match });
  }
  return matches;
}

export function matchClassAttributes(
  text: string,
  attributes: string[]
): RegExpMatchArray[] {
  const attrs = attributes
    .filter((x) => typeof x === "string")
    .flatMap((a) => [a, `\\[${a}\\]`]);
  const re = /(?:\s|:|\()(ATTRS)\s*=\s*['"`{]/;
  return findAll(
    new RegExp(re.source.replace("ATTRS", attrs.join("|")), "gi"),
    text
  );
}
