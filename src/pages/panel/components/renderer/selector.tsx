import { memo, useEffect, useState } from "react";
import { useClassController } from "@panel/context/class";
import { CodeEditor } from "../code-editor";

export const ClassSelector = memo(() => {
  const { selectedClass, onResolveClassName } = useClassController();
  const [css, setCSS] = useState("");

  useEffect(() => {
    const handleResolveClass = async () => {
      const result = await onResolveClassName(selectedClass);
      if (result) {
        setCSS(result);
      } else setCSS("");
    };

    handleResolveClass();
  }, [selectedClass]);

  if (!selectedClass) {
    return (
      <div className="flex h-full items-center justify-center p-10  text-xs italic text-neutral-500 dark:text-neutral-300">
        No selected class.
      </div>
    );
  }
  return (
    <div>
      <CodeEditor
        value={css}
        readOnly
        lang="css"
        className="hide-line-number"
      />
    </div>
  );
});
