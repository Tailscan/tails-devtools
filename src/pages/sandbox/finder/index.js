import { findInScale } from "./findInScale";
import { isColor, nearestColor, toRGBA } from "./color";
import { flatifyObject, get } from "./utils";

export const findByValue = (obj, _value) => {
  if (!_value) return [];
  return (
    Object.entries(obj).find(([_, value]) => {
      const processedVal = Array.isArray(value) ? value.join(",") : value;
      return (
        processedVal.replaceAll(/\s/g, "") === _value.replaceAll(/\s/g, "")
      );
    }) || []
  );
};

export const findOpacity = findInScale(Number);

export const findByColor = (val, config) => {
  if (!val) return [];
  if (val === "transparent") return [val];
  if (val === "currentColor" || val === "currentcolor") return ["current"];

  const colorScale = get(config.theme, "colors", {});
  const [_r, _g, _b, a] = toRGBA(val);
  const flatScale = flatifyObject(colorScale);
  const [className] = findByValue(flatScale, val);

  if (className) return [className, null, a];
  const colors = Object.values(flatScale).filter(isColor);
  const color = nearestColor(val, colors);

  const [_className] = findByValue(flatScale, color);

  let _opacityClass = null;
  if (a && a < 1) {
    const opacityScale = get(config.theme, "textOpacity", {});
    const [opacityClass] = findOpacity(opacityScale, a, {
      nearest: true,
    });
    _opacityClass = opacityClass ? opacityClass : null;
  }

  return _className ? [_className, _opacityClass, a] : [null, null, a];
};
