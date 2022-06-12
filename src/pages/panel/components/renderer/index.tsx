import { memo } from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import "react-reflex/styles.css";

import { useClassController } from "@panel/context/class";
import { normalize } from "./normalize";
import { Collapsible } from "./collapsible";
import { ClassSelector } from "./selector";

export const Renderer = memo(() => {
  const { classList } = useClassController();
  const normalizedClassList = Object.entries(normalize(classList));
  if (normalizedClassList.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-xs italic text-neutral-500 dark:text-neutral-300">
        No class found.
      </div>
    );
  }
  return (
    <ReflexContainer className="h-full flex-1" orientation="vertical">
      <ReflexElement
        className="overflow-auto"
        style={{ maxHeight: "calc(100vh - 56px)" }}
        flex={0.7}
        minSize={100}
      >
        {normalizedClassList.map(([name, normalized], idx) => {
          return (
            <Collapsible
              key={name}
              name={name}
              classList={normalized}
              first={idx === 0}
              last={idx === normalizedClassList.length - 1}
            />
          );
        })}
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement flex={0.5} minSize={100} className="h-full">
        <ClassSelector />
      </ReflexElement>
    </ReflexContainer>
  );
});
