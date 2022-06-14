import clsx from "clsx";
import React, { useEffect, useState } from "react";

import { FilterIcon, CopyIcon } from "@panel/icons";

import { ColorInspector } from "./color-inpsector";
import { ThemeToggle } from "./theme-toggle";
import { useSandbox } from "../context/sandbox";

interface FilterProps {
  value: string;
  copied: string | null;
  onChange: (value: string) => void;
  onCopy: () => void;
}

export const Filter: React.FC<FilterProps> = ({
  value,
  copied,
  onChange,
  onCopy,
}) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [foundColor, setFoundColor] = useState<string[]>();
  const { findColor } = useSandbox();

  useEffect(() => {
    const handleFindColor = async () => {
      const result = await findColor(selectedColor);
      setFoundColor(result);
    };
    if (selectedColor) {
      handleFindColor();
    } else {
      setFoundColor(undefined);
    }
  }, [selectedColor]);

  return (
    <div>
      <div className="flex h-7 w-full border-b border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="relative flex-1">
          <div className="absolute left-0 top-0 flex h-full w-5 items-center justify-center">
            <FilterIcon className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-300" />
          </div>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Filter"
            className="h-[27px] w-full border border-transparent px-1 pl-5 text-xs focus:border-blue-500 focus:outline-none dark:bg-neutral-800"
          />
        </div>
        <div className="flex items-center space-x-px px-1">
          <button
            onClick={onCopy}
            className={clsx(
              "flex h-6 w-6 cursor-default items-center justify-center rounded-sm bg-white hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
              copied ? "text-blue-500" : "text-neutral-700 dark:text-white"
            )}
          >
            <CopyIcon className="h-3.5 w-3.5" />
          </button>
          <ColorInspector onSelectColor={setSelectedColor} />
          <ThemeToggle />
        </div>
      </div>
      {selectedColor && (
        <div className="flex h-7 w-full items-center justify-between border-b border-neutral-300 bg-white px-1 text-xs dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center space-x-1">
            {foundColor ? (
              <div className="font-medium">
                <span>
                  {foundColor[0]}
                  {""}
                  {foundColor[1] && (
                    <>
                      <span className="mx-1 inline-block">·</span>
                      <span>opacity-{foundColor[1]}</span>
                    </>
                  )}
                </span>
              </div>
            ) : (
              <div className="text-xs italic text-neutral-500 dark:text-neutral-300">
                No color found.
              </div>
            )}
            <span
              className="shadow-px h-3 w-3 flex-none rounded-sm"
              style={{ background: selectedColor }}
            />
          </div>
          <div className="text-neutral-500">{selectedColor}</div>
        </div>
      )}
    </div>
  );
};
