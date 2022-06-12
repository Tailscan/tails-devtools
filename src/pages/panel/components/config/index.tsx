import { memo, useState } from "react";
import clsx from "clsx";

import { CloseIcon, CogIcon } from "@panel/icons";
import { useSandbox } from "@panel/context/sandbox";
import { CodeEditor } from "../code-editor";

export const Config = memo(() => {
  const [show, setShow] = useState(false);
  const { config, setConfig, saveConfig, saving } = useSandbox();
  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-0 left-0 right-0 z-20 flex h-7 w-full cursor-default items-center justify-center border-t border-neutral-300 bg-neutral-100 px-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
      >
        <CogIcon className="mr-px h-3.5 w-3.5" />
        <span>Config</span>
      </button>
      {show && (
        <div className="absolute inset-0 z-30 h-full w-full bg-neutral-50">
          <div className="relative flex h-8 items-center justify-between border-b border-neutral-200 bg-neutral-100 px-1 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="relative flex h-full cursor-default items-center px-3 text-xs font-medium">
              Config
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-500 transition-opacity duration-150"></span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="flex h-6 w-6 cursor-default items-center justify-center rounded-sm bg-transparent text-[11px] font-semibold transition-colors duration-150 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                onClick={() => setShow(false)}
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="relative h-full w-full">
            <button
              onClick={() => saveConfig()}
              disabled={saving}
              className={clsx(
                "fixed bottom-4 right-4 z-40 flex h-7 items-center rounded-sm bg-blue-500 px-3 text-xs font-medium text-white",
                saving && "cursor-not-allowed opacity-80"
              )}
            >
              {saving && (
                <svg
                  className="-ml-1 mr-2 h-3.5 w-3.5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {saving ? "Saving..." : "Save"}
            </button>
            <CodeEditor value={config} onChange={setConfig} lang="javascript" />
          </div>
        </div>
      )}
    </>
  );
});
