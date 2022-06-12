import React, { useCallback } from "react";

import { Autocomplete, Filter, Renderer, Config } from "./components";

import { bridge } from "./bridge";
import { useClassList } from "./hooks";
import { useSandbox } from "./context/sandbox";
import { ClassListProvider } from "./context/class";

const Panel = () => {
  const [autocompleteValue, setAutocompleteValue] = React.useState("");
  const [selectedClass, setSelectedClass] = React.useState("");

  const {
    saveHtml,
    suggestions,
    resolveCompletionItem,
    resolveColor,
    resolveClassName,
  } = useSandbox();

  const {
    classList,
    filterValue,
    handleFetchElement,
    handleFilterChange,
    handleToggleClass,
    handleCopy,
  } = useClassList({
    onReset: () => {
      setAutocompleteValue("");
      setSelectedClass("");
    },
  });

  const handleHitEnter = useCallback(
    async (classList: string) => {
      console.log("enter", classList);
      saveHtml(classList);
      const classNames = classList.split(/[\s+]/);
      const promises: Promise<void>[] = [];
      classNames.forEach((className) => {
        promises.push(bridge.toggleClass(className, true));
      });
      await Promise.all(promises);
      handleFetchElement();
    },
    [saveHtml]
  );
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans'",
      }}
      className="relative flex max-h-full min-h-screen w-full flex-col overflow-hidden bg-white text-black dark:bg-neutral-800 dark:text-white"
    >
      <Filter
        value={filterValue}
        onChange={handleFilterChange}
        onCopy={handleCopy}
      />
      <Autocomplete
        completions={suggestions}
        inputValue={autocompleteValue}
        onChange={setAutocompleteValue}
        onEnter={handleHitEnter}
        onResolveCompleteItem={resolveCompletionItem}
      />

      <ClassListProvider
        classList={classList}
        onToggleClass={handleToggleClass}
        onResolveColor={resolveColor}
        onResolveClassName={resolveClassName}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      >
        <Renderer />
      </ClassListProvider>

      <Config />
    </div>
  );
};

export default Panel;
