import React, { memo } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import cx from "clsx";
import { colors } from "vc.tailwindcss";

import { CloseIcon } from "@panel/icons";
import clsx from "clsx";

interface ColorSwatchesProps {
  color: string;
}

type Colors = Record<string, string | any>;

export const ColorSwatches: React.FC<ColorSwatchesProps> = memo(({ color }) => {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <span
          className="shadow-px h-3 w-3 flex-none rounded-sm"
          style={{ background: color }}
        />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        align="center"
        sideOffset={4}
        className={cx(
          "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
          "relative max-h-72 w-48 overflow-y-auto rounded-lg px-3 pt-4 pb-2 shadow-md md:w-56",
          "space-y-4 border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
        )}
      >
        {Object.entries(colors as Colors)
          .filter(([_, palette]) => typeof palette !== "string")
          .map(([colorName, palette]) => {
            const isPalette = typeof palette === "object";
            const scale = isPalette ? Object.keys(palette) : [];
            return (
              <div key={colorName}>
                <div className="mb-2 text-xs font-medium text-black dark:text-white">
                  {colorName}
                </div>
                <div
                  className={clsx(
                    "grid w-full grid-cols-5 gap-0 overflow-hidden rounded-sm p-0 text-center",
                    isPalette ? "h-10" : "h-5"
                  )}
                >
                  {isPalette &&
                    scale.map((paletteIdx, key) => (
                      <div
                        className="group cursor-pointer transition-transform duration-150 hover:scale-110"
                        key={key}
                        style={{ background: (palette as any)[paletteIdx] }}
                        tabIndex={-1}
                      >
                        <span
                          className="text-[10px] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                          style={{
                            color: (palette as any)[scale[9 - key]],
                          }}
                        >
                          {paletteIdx}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}

        <PopoverPrimitive.Close
          className={cx(
            "absolute top-0 right-2 z-10 inline-flex items-center justify-center rounded-full p-0.5 dark:bg-neutral-800",
            "focus:outline-none"
          )}
        >
          <CloseIcon className="h-3.5 w-3.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100" />
        </PopoverPrimitive.Close>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
});
