import { memo, useEffect, useState } from "react";

import { useClassController } from "@panel/context/class";
import { useTheme } from "@panel/context/theme";
import { Checkbox } from "../checkbox";
import { NormalizedClass } from "./normalize";
import { ColorSwatches } from "../color-swatches";

export const ClassItem = memo(
  ({
    className,
    isVariant,
  }: {
    className: NormalizedClass;
    isVariant: boolean;
  }) => {
    const { onToggleClass, onResolveColor, setSelectedClass } =
      useClassController();
    const { themeName } = useTheme();

    const [color, setColor] = useState<string | undefined>();

    useEffect(() => {
      const handleResolveClass = async () => {
        const [newColor] = await Promise.all([
          onResolveColor(className.normalized),
        ]);
        setColor(newColor);
      };
      handleResolveClass();
    }, []);

    return (
      <div
        className="cursor-pointer py-px hover:bg-neutral-200 dark:hover:bg-neutral-700"
        onClick={() => setSelectedClass(className.className)}
      >
        <div className="flex items-center space-x-2">
          <span
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              checked={className.checked}
              color={
                isVariant
                  ? themeName === "dark"
                    ? "purple"
                    : "teal"
                  : themeName === "dark"
                  ? "rose"
                  : "rose"
              }
              onChange={(e) => {
                onToggleClass(className.className, (e.target as any).checked);
              }}
            >
              {className.normalized}
            </Checkbox>
          </span>
          {color && <ColorSwatches color={color} />}
        </div>
      </div>
    );
  }
);
