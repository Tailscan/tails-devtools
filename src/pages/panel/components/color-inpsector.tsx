import clsx from "clsx";
import { memo } from "react";
import { ColorPickerIcon } from "../icons";

interface ColorInspectorProps {
  onSelectColor: (color: string) => void;
}

export const ColorInspector = memo(({ onSelectColor }: ColorInspectorProps) => {
  return (
    <button
      className={clsx(
        "relative flex h-6 w-6 cursor-default items-center justify-center rounded-sm bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700",
        "text-neutral-700 dark:text-white"
      )}
    >
      <input
        type="color"
        className="cursor-default"
        onInput={(e) => onSelectColor((e.target as HTMLInputElement).value)}
      />
      <ColorPickerIcon className="h-3.5 w-3.5" />
    </button>
  );
});
