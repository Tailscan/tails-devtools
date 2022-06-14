/* eslint-disable no-useless-escape */
export const flatifyObject = (object, options) => {
  options = {
    onlyLeaves: false,
    ...options,
  };

  const flattened = {};

  for (const key in object) {
    if (!Object.hasOwnProperty.call(object, key)) {
      continue;
    }

    if (typeof object[key] === "object" && object[key] !== null) {
      const flatObject = flatifyObject(object[key]);
      for (const flatObjectKey in flatObject) {
        if (!Object.hasOwnProperty.call(flatObject, flatObjectKey)) {
          continue;
        }

        if (options.onlyLeaves) {
          flattened[flatObjectKey] = flatObject[flatObjectKey];
        } else {
          flattened[key + "-" + flatObjectKey] = flatObject[flatObjectKey];
        }
      }
    } else {
      flattened[key] = object[key];
    }
  }

  return flattened;
};

function getFontSize() {
  if (typeof window === "undefined") return parseFloat(16);
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize) ||
    parseFloat(16)
  );
}

export const convertCssUnit = (cssValue) => {
  const supportedUnits = {
    // Absolute sizes
    px: (value) => value,
    cm: (value) => value * 38,
    mm: (value) => value * 3.8,
    q: (value) => value * 0.95,
    in: (value) => value * 96,
    pc: (value) => value * 16,
    pt: (value) => value * 1.333333,

    // Relative sizes
    rem: (value) => value * getFontSize(),
    em: (value) => value * getFontSize(),

    // Times
    ms: (value) => value,
    s: (value) => value * 1000,

    // Angles
    deg: (value) => value,
    rad: (value) => value * (180 / Math.PI),
    grad: (value) => value * (180 / 200),
    turn: (value) => value * 360,

    // FIXME: should we return raw string
    // '%': (value) => value,
    // vw: (value) => {
    //   const w = Math.max(
    //     document.documentElement.clientWidth,
    //     window.innerWidth || 0
    //   );
    //   return (value * w) / 100;
    // },
    // vh: (value) => {
    //   const h = Math.max(
    //     document.documentElement.clientHeight,
    //     window.innerHeight || 0
    //   );
    //   return (value * h) / 100;
    // },
  };

  // Match positive and negative numbers including decimals with following unit
  const pattern = new RegExp(
    `^([\-\+]?(?:\\d+(?:\\.\\d+)?))(${Object.keys(supportedUnits).join("|")})$`,
    "i"
  );

  // If is a match, return example: [ "-2.75rem", "-2.75", "rem" ]
  const matches = String.prototype.toString
    .apply(cssValue)
    .trim()
    .match(pattern);

  if (matches) {
    const value = Number(matches[1]);
    const unit = matches[2].toLocaleLowerCase();

    // Sanity check, make sure unit conversion function exists
    if (unit in supportedUnits) {
      return supportedUnits[unit](value);
    }
  }

  return cssValue;
};

export const isNegative = (className) => className[0] === "-"; // true

export const get = (obj, key, def, p, undef) => {
  if (obj && obj[key]) return obj[key];
  key = Array.isArray(key) ? key : key && key.split ? key.split(".") : [key];
  for (p = 0; p < key.length; p++) {
    obj = obj && typeof obj === "object" ? obj[key[p]] : undef;
  }
  return obj === undef ? def : obj;
};
