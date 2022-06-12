import clsx from "clsx";
import { memo, useState } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { ChavronDown } from "@panel/icons";
import { useClassController } from "@panel/context/class";

import { NormalizedClassList } from "./normalize";
import { ClassItem } from "./item";

interface CollapsibleProps {
  name: string;
  classList: NormalizedClassList;
  first: boolean;
  last: boolean;
}

export const Collapsible: React.FC<CollapsibleProps> = memo(
  ({ name, classList, first, last }) => {
    const { inspectedEl } = useClassController();
    const isDefault = name === "DEFAULT";
    const [isOpen, setIsOpen] = useState(true);

    return (
      <CollapsiblePrimitive.Root
        open={isOpen}
        onOpenChange={setIsOpen}
        className={clsx(
          "w-full font-mono",
          !isOpen ? "pb-0" : last ? "pb-12" : "pb-2"
        )}
      >
        <CollapsiblePrimitive.Trigger
          className={clsx(
            "group flex h-7 w-full items-center justify-between space-x-2 border-b border-neutral-300 bg-neutral-100 px-1 text-xs dark:border-neutral-700 dark:bg-neutral-900",
            isOpen && "mb-2",
            !first && "border-t"
          )}
        >
          <span
            className={clsx(
              "font-medium",
              isDefault && "text-purple-500 dark:text-blue-300"
            )}
          >
            {isDefault ? inspectedEl?.displayName || "This Element" : name}
          </span>
          <ChavronDown
            className={clsx(
              "h-3.5 w-3.5 transform duration-150 ease-in-out group-radix-state-open:rotate-180"
            )}
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="space-y-1 px-1">
          {classList.map((className) => (
            <ClassItem
              key={className.className}
              className={className}
              isVariant={!isDefault}
            />
          ))}
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    );
  }
);
