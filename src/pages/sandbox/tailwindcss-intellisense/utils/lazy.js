// https://www.codementor.io/@agustinchiappeberrini/lazy-evaluation-and-javascript-a5m7g8gs3
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export const lazy = (getter) => {
  let evaluated = false;
  let _res = null;
  const res = function () {
    if (evaluated) return _res;
    _res = getter.apply(this, arguments);
    evaluated = true;
    return _res;
  };
  res.isLazy = true;
  return res;
};
