import postcss from "postcss";
import { tailwindcss } from "vc.tailwindcss";
import * as culori from "culori";

import { actions } from "../panel/actions";
import { CompleteItem } from "../panel/components";
import { defaultCSS } from "../panel/files";
import { parseConfig } from "./parseConfig";
import { getColor } from "./tailwindcss-intellisense/utils/color";
import { TailwindCSS } from "./worker";

const VIRTUAL_SOURCE_PATH = "/sourcePath";
const VIRTUAL_HTML_FILENAME = "/htmlInput";

(() => {
  let tailwindInstance: TailwindCSS;
  let lastProcessedHtml = "";
  // Set up message event handler:
  window.addEventListener("message", async function (event) {
    tailwindInstance = tailwindInstance || new TailwindCSS({});
    const type = event.data?.type;

    if (type) {
      switch (type) {
        case actions.changeConfig: {
          const configStr = event.data.payload;
          try {
            const config = await parseConfig(configStr, 3);
            tailwindInstance.changeUserConfig(config);
            const suggestions = tailwindInstance.provideCompletionItems();
            if (event && event.source) {
              event.source.postMessage(
                {
                  type: actions.complete,
                  payload: suggestions,
                },
                event.origin as any
              );
            }
          } catch (e) {
            console.log(e);
          }
          break;
        }
        case actions.resolveCompleteItem: {
          const result = await tailwindInstance.resolveCompletionItem(
            event.data.payload as CompleteItem
          );
          if (event && event.source) {
            event.source.postMessage(
              {
                _id: event.data._id,
                payload: result,
              },
              event.origin as any
            );
          }
          break;
        }
        case actions.resolveColor: {
          const result = getColor(tailwindInstance.state, event.data.payload);
          if (event && event.source) {
            event.source.postMessage(
              {
                _id: event.data._id,
                payload: result ? culori.formatRgb(result) : "",
              },
              event.origin as any
            );
          }
          break;
        }
        case actions.hover: {
          const result = await tailwindInstance.doHover(event.data.payload);
          console.log({ result });
          if (event && event.source) {
            event.source.postMessage(
              {
                _id: event.data._id,
                payload: result,
              },
              event.origin as any
            );
          }
          break;
        }
        case actions.compile: {
          const { config: configStr, html, force } = event.data.payload;
          (window as any)[VIRTUAL_HTML_FILENAME] = html;

          if (
            (window as any)[VIRTUAL_HTML_FILENAME] === lastProcessedHtml &&
            !force
          ) {
            return;
          }
          lastProcessedHtml = (window as any)[VIRTUAL_HTML_FILENAME];
          const defaultConfig = {
            mode: "jit",
            purge: [VIRTUAL_HTML_FILENAME],
            theme: {},
            plugins: [],
          };

          try {
            const userConfig = await parseConfig(configStr, 3);
            console.log({ config: { ...defaultConfig, ...userConfig } });
            const result = await postcss([
              tailwindcss({ ...defaultConfig, ...userConfig }),
            ]).process(defaultCSS, {
              from: VIRTUAL_SOURCE_PATH,
            });
            if (event && event.source) {
              event.source.postMessage(
                {
                  type: actions.compiled,
                  payload: result.css,
                },
                event.origin as any
              );
            }
          } catch (e) {
            console.log(e);
          }
          break;
        }
        default:
          break;
      }
    }
  });
})();
