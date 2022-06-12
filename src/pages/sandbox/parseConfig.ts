// forked https://github.com/tailwindlabs/play.tailwindcss.com/blob/master/src/workers/parseConfig.js
import { colors } from "vc.tailwindcss";

const CONSTANTS = {
  PLUGIN_BUILDER_VERSION: "5",
  VIRTUAL_SOURCE_PATH: "/sourcePath",
  VIRTUAL_HTML_FILENAME: "/htmlInput",
  PLUGINS: {},
};

const { PLUGIN_BUILDER_VERSION } = CONSTANTS;

declare const __shimport__: any;

const self = window;

export async function parseConfig(configStr: string, tailwindVersion: number) {
  const mod = {
    exports: {},
  };

  try {
    await (0, eval)('import("")');
  } catch (error) {
    if (error instanceof TypeError) {
      (self as any).importShim = (0, eval)("u=>import(u)");
    } else {
      (self as any).importShim = __shimport__.load;
    }
  }

  class RequireError extends Error {
    line: number;
    constructor(message: string, line: number) {
      super(message);
      this.name = "RequireError";
      this.line = line;
    }
  }

  const builtinPlugins = {
    _builderVersion: PLUGIN_BUILDER_VERSION,
    _tailwindVersion: tailwindVersion,
    ...{},
  };

  const before = `(async function(module){
    const require = async (m, line, builtinPlugins) => {
      if (typeof m !== 'string') {
        throw new RequireError('The "id" argument must be of type string. Received ' + typeof m, line)
      }
      if (m === '') {
        throw new RequireError("The argument 'id' must be a non-empty string. Received ''", line)
      }
      if (/^tailwindcss\\/colors(\\.js)?$/.test(m)) {
        ${
          colors
            ? `return ${JSON.stringify(colors)}`
            : `throw new RequireError("Cannot find module '" + m + "'", line)`
        }
      }
      let result
      try {
        const href = builtinPlugins[m]
          ? '/plugins/' + builtinPlugins._builderVersion + '/v' + builtinPlugins._tailwindVersion + '/' + m + '@' + builtinPlugins[m].version + '.js'
          : 'https://cdn.skypack.dev/' + m + '?min'
        result = await self.importShim(href)
      } catch (error) {
        throw new RequireError("Cannot find module '" + m + "'", line)
      }
      return result.default || result
    }`;
  const after = `})(mod)`;

  try {
    await eval(
      before +
        "\n" +
        configStr
          .split("\n")
          .map((line, i) =>
            line.replace(
              /\brequire\(([^(]*)\)/g,
              (_m, id) =>
                `(await require(${id.trim() === "" ? "undefined" : id}, ${
                  i + 1
                }, ${JSON.stringify(builtinPlugins)}))`
            )
          )
          .join("\n") +
        "\n" +
        after
    );
  } catch (error: any) {
    let line;

    if (error instanceof RequireError) {
      line = error.line;
    } else if (typeof error.line !== "undefined") {
      line = error.line - 1 - before.split("\n").length;
    } else {
      const lines = error.stack.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const re = /:([0-9]+):([0-9]+)/g;
        const matches = [];
        let match;
        while ((match = re.exec(lines[i])) !== null) {
          matches.push(match);
        }
        if (matches.length > 0) {
          line =
            parseInt(matches[matches.length - 1][1], 10) -
            before.split("\n").length;
          break;
        }
      }
    }

    return {
      _error: {
        message: error.message,
        line: typeof line === "undefined" ? undefined : line,
      },
    };
  }

  return mod.exports || {};
}
