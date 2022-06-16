export const isChrome = typeof browser === "undefined";

export const platform = isChrome ? chrome : browser;
