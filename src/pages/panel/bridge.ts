import { platform } from "@src/platform";
import {
  InspectedElement,
  inspectElement,
  toggleClassList,
  localStorageGetItem,
  localStorageRemoveItem,
  localStorageSetItem,
  injectCSS,
  setClassList,
} from "./remote";

const devtools = platform.devtools;
const inspectedWindow = devtools.inspectedWindow;

export const factory =
  (inspect: boolean) => (fn: any, args: any, callback: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    callback = callback || function () {};

    if (inspect) {
      args = ["$0"].concat(args || []);
    } else args = [].concat(args || []);
    args.forEach(function (item: any, index: number) {
      if ((index || !inspect) && typeof item === "string") {
        // args[index] = '"' + item + '"';
        args[index] = JSON.stringify(item);
      }
    });
    return inspectedWindow.eval(
      "(" + fn.toString() + ")(" + args.join() + ")",
      callback
    );
  };

export const inspect = factory(true);
export const execute = factory(false);

const fetchElement = async (): Promise<InspectedElement> => {
  return new Promise((resolve) => {
    inspect(inspectElement, [], (element: InspectedElement) => {
      resolve(element);
    });
  });
};

export const bridge = {
  fetchElement,
  toggleClass: async (name: string, active: boolean) => {
    return new Promise<void>((resolve) => {
      inspect(toggleClassList, [name, active], () => {
        resolve();
      });
    });
  },
  setClassList: async (classList: string) => {
    return new Promise<void>((resolve) => {
      inspect(setClassList, [classList], () => {
        resolve();
      });
    });
  },
  injectCSS: (css: string) => {
    return new Promise<void>((resolve) => {
      execute(injectCSS, [css], () => {
        resolve();
      });
    });
  },
  storage: {
    get: (key: string) => {
      return new Promise<any>((resolve) => {
        execute(localStorageGetItem, [key], (result: any) => {
          resolve(result);
        });
      });
    },
    remove: (key: string) => {
      return new Promise<void>((resolve) => {
        execute(localStorageRemoveItem, [key], () => {
          resolve();
        });
      });
    },
    set: (key: string, value: any) => {
      return new Promise<void>((resolve) => {
        execute(localStorageSetItem, [key, value], () => {
          resolve();
        });
      });
    },
  },
  // event
  onSelectionChanged: (cb: (element: InspectedElement) => void) => {
    const handleSelectionChanged = async () => {
      const element = await fetchElement();
      cb(element);
    };
    devtools.panels.elements.onSelectionChanged.addListener(
      handleSelectionChanged
    );

    return () => {
      devtools.panels.elements.onSelectionChanged.removeListener(
        handleSelectionChanged
      );
    };
  },
};
