import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { useLocalStorage } from "../hooks";

export function getBrowserTheme() {
  return chrome.devtools.panels.themeName === "dark" ? "dark" : "light";
}

type Theme = "dark" | "light" | "auto";

export interface ThemeContext {
  theme: Theme;
  themeName: "light" | "dark";
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContext>({
  theme: "auto",
  themeName: "light",
  toggleTheme: () => null,
});
ThemeContext.displayName = "ClassListCoThemeContextntext";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = memo(
  ({ children }) => {
    const [theme, setTheme] = useLocalStorage<Theme>(
      "TailwindCSS::theme",
      "auto"
    );

    const toggleTheme = useCallback(() => {
      if (theme === "light") setTheme("dark");
      if (theme === "dark") setTheme("auto");
      if (theme === "auto") setTheme("light");
    }, [theme]);

    const updateTheme = useCallback((newTheme: "dark" | "light") => {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }, []);

    useLayoutEffect(() => {
      switch (theme) {
        case "light":
          updateTheme("light");
          break;
        case "dark":
          updateTheme("dark");
          break;
        case "auto": {
          const newTheme = getBrowserTheme();
          updateTheme(newTheme);
          break;
        }
        default:
          throw Error(`Unsupported theme value "${theme}"`);
      }
    }, [theme]);

    const value = useMemo(() => {
      return {
        theme,
        toggleTheme,
        themeName: theme === "auto" ? getBrowserTheme() : theme,
      };
    }, [theme, toggleTheme]);

    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  }
);

export const useTheme = () => useContext(ThemeContext);
