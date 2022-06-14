import colorConvert from "color-convert";
import euclideanDistance from "euclidean-distance";

import colorString from "color-string";

const invalidColors = ["transparent", "currentColor"];
export const isColor = (color) => {
  if (invalidColors.indexOf(color) !== -1) return false;
  // return Boolean(colorString.get.rgb(color));
  return Boolean(colorString.get(color));
};

function hasAlpha(color) {
  return (
    color.startsWith("rgba(") ||
    color.startsWith("hsla(") ||
    (color.startsWith("#") && color.length === 9) ||
    (color.startsWith("#") && color.length === 5)
  );
}

export function toRGBA(color) {
  const parsedColor = colorString.get(color);
  if (!parsedColor) return [];
  if (parsedColor.model !== "rgb") {
    return [
      ...(colorConvert[parsedColor.model].rgb(parsedColor.value) || []),
      1,
    ];
  }
  const [r, g, b, a] = parsedColor.value || [];
  return [r, g, b, a === undefined && hasAlpha(color) ? 1 : a];
}

export function toRGB(color) {
  const parsedColor = colorString.get(color);
  if (!parsedColor) return [];
  if (parsedColor.model !== "rgb") {
    return colorConvert[parsedColor.model].rgb(parsedColor.value) || [];
  }
  const [r, g, b, a] = parsedColor.value || [];
  return [r, g, b];
}

export function isClassColor(className, colors) {
  for (const [key, value] of Object.entries(colors)) {
    if (className.endsWith("-" + key)) {
      return Array.isArray(value) ? value[0] : value;
    }
  }
}

export function hex2RGB(hex) {
  const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;
  const [, short, long] = String(hex).match(RGB_HEX) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    return [value >> 16, (value >> 8) & 0xff, value & 0xff];
  } else if (short) {
    return Array.from(short, (s) => Number.parseInt(s, 16)).map(
      (n) => (n << 4) | n
    );
  }
}

export function nearestColor(needle, colors) {
  needle = toRGB(needle);

  if (!needle) {
    return null;
  }

  if (Array.isArray(needle) && needle.length === 0) return null;

  let distanceSq,
    minDistanceSq = Infinity,
    value;

  for (var i = 0; i < colors.length; ++i) {
    distanceSq = euclideanDistance(needle, toRGB(colors[i]));

    if (distanceSq < minDistanceSq) {
      minDistanceSq = distanceSq;
      value = colors[i];
    }
  }

  return value;
}
