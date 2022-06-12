/* eslint-disable @typescript-eslint/no-empty-function */
import dlv from "dlv";

export function runPlugin(plugin, state, overrides) {
  try {
    (plugin.handler || plugin)({
      addUtilities: () => {},
      addComponents: () => {},
      addBase: () => {},
      matchUtilities: () => {},
      addVariant: () => {},
      e: (x) => x,
      prefix: (x) => x,
      theme: (path, defaultValue) =>
        dlv(state.config, `theme.${path}`, defaultValue),
      variants: () => [],
      config: (path, defaultValue) => dlv(state.config, path, defaultValue),
      corePlugins: (path) => {
        if (Array.isArray(state.config.corePlugins)) {
          return state.config.corePlugins.includes(path);
        }
        return dlv(state.config, `corePlugins.${path}`, true);
      },
      target: (path) => {
        if (typeof state.config.target === "string") {
          return state.config.target;
        }
        const [defaultTarget, targetOverrides] = dlv(state.config, "target");
        return dlv(targetOverrides, path, defaultTarget);
      },
      postcss: state.modules.postcss.module,
      ...overrides,
    });
  } catch (e) {
    console.log(e);
  }
}
