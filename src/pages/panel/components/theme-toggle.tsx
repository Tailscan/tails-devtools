import { memo } from "react";
import { useTheme } from "../context/theme";
import { DesktopIcon, MoonIcon, SunIcon } from "../icons";

export const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex h-6 w-6 cursor-default items-center justify-center rounded-sm bg-neutral-200 text-[11px] text-blue-500 transition-colors duration-150 dark:bg-neutral-700"
    >
      {theme === "light" && <SunIcon className="h-3.5 w-3.5" />}
      {theme === "dark" && <MoonIcon className="h-3.5 w-3.5" />}
      {theme === "auto" && <DesktopIcon className="h-3.5 w-3.5" />}
    </button>
  );
});
