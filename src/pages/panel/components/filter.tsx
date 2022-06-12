import clsx from "clsx";
import React from "react";
import { FilterIcon } from "../icons";
import { ThemeToggle } from "./theme-toggle";

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
  return (
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
};
