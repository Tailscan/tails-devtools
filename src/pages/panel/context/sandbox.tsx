import React, {
  createContext,
  memo,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { actions } from "../actions";
import { bridge } from "../bridge";
import { CompleteItem } from "../components";
import { defaultConfig } from "../files";
import { useMessage, useMount, useUpdate } from "../hooks";

export type SandboxContextType = {
  suggestions: CompleteItem[];
  config: string;
  saving: boolean;
  setConfig: (config: string) => void;
  saveHtml: (html: string) => void;
  saveConfig: () => void;
  resolveCompletionItem: (
    item: CompleteItem
  ) => Promise<CompleteItem | undefined>;
  resolveColor: (item: string) => Promise<string | undefined>;
  findColor: (item: string) => Promise<string[] | undefined>;
  resolveClassName: (item: string) => Promise<string | undefined>;
};

const SandboxContext = createContext<SandboxContextType>({
  config: "",
  saving: false,
  suggestions: [],
  setConfig: () => null,
  saveHtml: () => null,
  saveConfig: () => null,
  resolveCompletionItem: async () => undefined,
  resolveColor: async () => undefined,
  findColor: async () => undefined,
  resolveClassName: async () => undefined,
});
SandboxContext.displayName = "SandboxContext";

interface SandboxProviderProps {
  children: React.ReactNode;
  iframe: HTMLIFrameElement;
}
const CONFIG_KEY = `__tailwindcss_config`;

export const SandboxProvider: React.FC<SandboxProviderProps> = memo(
  ({ children, iframe }) => {
    const { listen, dispatch, request } = useMessage(iframe);
    const [configStr, setConfigStr] = useState("");
    const [saving, setSaving] = useState(false);

    const [html, setHtml] = useState("");
    const [suggestions, setSuggestions] = useState<CompleteItem[]>([]);

    useMount(() => {
      async function handleFetchConfig() {
        const savedConfigStr = await bridge.storage.get(CONFIG_KEY);
        let newConfigStr = "";
        if (!savedConfigStr) {
          bridge.storage.set(CONFIG_KEY, defaultConfig);
          newConfigStr = defaultConfig;
        } else {
          newConfigStr = savedConfigStr;
        }
        setConfigStr(newConfigStr);
        dispatch({
          type: actions.changeConfig,
          payload: newConfigStr,
        });
      }
      handleFetchConfig();
    });

    useMount(() => {
      listen(actions.complete, setSuggestions);

      listen(actions.compiled, (css: string) => {
        setSaving(false);
        bridge.injectCSS(css);
      });
    });

    useUpdate(() => {
      dispatch({
        type: actions.compile,
        payload: {
          html,
          config: configStr,
        },
      });
    }, [html]);

    const resolveCompletionItem = useCallback(async (item: CompleteItem) => {
      const result = (await request({
        type: actions.resolveCompleteItem,
        payload: item,
      })) as CompleteItem;
      return result || undefined;
    }, []);

    const resolveColor = useCallback(async (className: string) => {
      const result = (await request({
        type: actions.resolveColor,
        payload: className,
      })) as string;
      return result || undefined;
    }, []);

    const findColor = useCallback(async (color: string) => {
      const result = (await request({
        type: actions.findColor,
        payload: color,
      })) as string[];
      return result || undefined;
    }, []);

    const resolveClassName = useCallback(async (className: string) => {
      const result = (await request({
        type: actions.hover,
        payload: className,
      })) as string;
      return result || undefined;
    }, []);

    const saveConfig = useCallback(() => {
      setSaving(true);
      bridge.storage.set(CONFIG_KEY, configStr);
      dispatch({
        type: actions.changeConfig,
        payload: configStr,
      });
      dispatch({
        type: actions.compile,
        payload: {
          html,
          config: configStr,
          force: true,
        },
      });
    }, [html, configStr]);

    const saveHtml = useCallback(
      (classNames: string) => {
        setHtml((prev) => `${prev} ${classNames}`);
      },
      [html]
    );

    const value = useMemo(() => {
      return {
        suggestions,
        config: configStr,
        saving,
        setConfig: setConfigStr,
        saveConfig,
        saveHtml,
        resolveCompletionItem,
        resolveColor,
        findColor,
        resolveClassName,
      };
    }, [configStr, saving, saveConfig, suggestions]);

    return (
      <SandboxContext.Provider value={value}>
        {children}
      </SandboxContext.Provider>
    );
  }
);

export const useSandbox = () => useContext(SandboxContext);
