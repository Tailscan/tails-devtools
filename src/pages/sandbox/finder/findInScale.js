const compare = (a, b) => {
  const v1 = Array.isArray(a) ? a.join(",") : a;
  const v2 = Array.isArray(b) ? b.join(",") : b;
  return String(v1).replaceAll(/\s/g, "") === String(v2).replaceAll(/\s/g, "");
};

const isPercent = (val) =>
  Boolean(
    String(val)
      .trim()
      // eslint-disable-next-line no-useless-escape
      .match(new RegExp(`^([\-\+]?(?:\\d+(?:\\.\\d+)?))(%)$`, "i"))
  );

const isNumber = (val) => typeof val === "number";

const defaultOptions = {
  nearest: false,
  range: true,
};

export const findInScale =
  (format = (value) => value) =>
  (scale = {}, value, _options = {}) => {
    const options = {
      ...defaultOptions,
      ..._options,
    };

    if (!value) return [];

    const rounder = (num) => {
      if (typeof num !== "number") return num;

      const formattedScale = Object.values(scale)
        .map((val) => format(val))
        .filter((val) => typeof val === "number")
        .sort((a, z) => a - z);

      if (formattedScale.length === 0) return num;

      if (
        options.range &&
        (num < formattedScale[0] ||
          num > formattedScale[formattedScale.length - 1])
      ) {
        return num;
      }

      const closest = formattedScale.reduce(function (prev, curr) {
        return Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev;
      });
      return closest;
    };

    const convertedValue = format(value);

    const convertedScale = Object.entries(scale).map(([prefix, scaleValue]) => {
      return [prefix, format(scaleValue)];
    });

    const foundedPrefix =
      convertedScale.find(([_, convertedScaleValue]) => {
        const has1Percent =
          [convertedValue, convertedScaleValue].filter((val) => isPercent(val))
            .length === 1;

        // if value = x% and scale value is xrem auto return false;
        if (has1Percent) return false;

        if (!options.nearest || convertedValue === convertedScaleValue) {
          // one of theme is percent value
          return compare(convertedValue, convertedScaleValue);
        }

        // not same type
        if (!isNumber(convertedValue) || !isNumber(convertedScaleValue)) {
          // return convertedValue === convertedScaleValue;
          return compare(convertedValue, convertedScaleValue);
        }
        const roundedValue = rounder(convertedValue);
        // just compare 0 case
        if (
          (convertedScaleValue === roundedValue &&
            Number(roundedValue) === 0 &&
            Number(convertedValue) !== 0) ||
          (convertedValue === 0 && roundedValue !== 0)
        ) {
          return false;
        }

        return compare(roundedValue, convertedScaleValue);
      }) || [];

    return foundedPrefix;
  };
