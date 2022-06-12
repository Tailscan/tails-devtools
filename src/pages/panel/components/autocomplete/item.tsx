import React from "react";
import cx from "clsx";
import fuzzysort from "fuzzysort";
import { ListProps } from "./list";

interface AutocompleteItemProps {
  index: number;
  style: React.CSSProperties;
  data: ListProps;
}

export const AutocompleteItem = ({
  index,
  style,
  data,
}: AutocompleteItemProps) => {
  const { completions, fuzzySort, highlightedIndex, getItemProps } = data;
  const completion = completions[index];
  const key = `${completion.label}-${index}`;
  const result = fuzzySort
    ? fuzzySort.find((fuzzy) => fuzzy.obj.label === completion.label)
    : undefined;
  const highlighted = index === highlightedIndex;

  // TODO: FIXME
  // useEffect(() => {
  //   const handleResolveCompletionItem = async () => {
  //     if (!onResolveCompleteItem) return null;
  //     const newItem = await onResolveCompleteItem(completion);
  //     if (newItem && newItem.label === completion.label && !unmounted.current) {
  //       setResolved(newItem);
  //     }
  //   };
  //   if (!resolved) {
  //     handleResolveCompletionItem();
  //   }

  //   return () => {
  //     unmounted.current = true;
  //   };
  // }, [key]);

  return (
    <li
      {...getItemProps({
        key,
        className: cx(
          "flex cursor-pointer items-center justify-between space-x-1.5 pl-2.5 pr-3",
          highlighted && "bg-blue-500 text-white"
        ),
        item: completion,
        index,
        style,
      })}
    >
      <div className="flex items-center space-x-1.5">
        <span className="flex w-4 flex-none justify-center">
          {completion.kind === 16 && completion.documentation ? (
            <span
              className="shadow-px h-3 w-3 flex-none rounded-sm"
              style={{ background: completion.documentation }}
            />
          ) : (
            <svg
              width="16"
              height="10"
              fill="none"
              className={cx(
                highlighted ? "text-white" : "text-black dark:text-white"
              )}
            >
              <rect
                x=".5"
                y=".5"
                width="15"
                height="9"
                rx="1.5"
                stroke="currentColor"
              />
              <path fill="currentColor" d="M4 3h8v1H4zM4 6h8v1H4z" />
            </svg>
          )}
        </span>

        {result ? (
          <span className="flex-1 text-left">
            {fuzzysort.highlight(result as any, (m, i) => (
              <mark
                className={cx(
                  "bg-transparent font-semibold",
                  highlighted ? "text-white" : "text-blue-500"
                )}
                key={i}
              >
                {m}
              </mark>
            ))}
          </span>
        ) : (
          <span className="flex-1 text-left">{completion.label}</span>
        )}
      </div>
      {/* {highlighted && completion.kind !== 16 && resolved?.detail ? (
          <span className="max-w-[128px] truncate pl-4 text-right text-neutral-300">
            {typeof resolved?.detail === "string" ? resolved?.detail : ""}
          </span>
        ) : null} */}
      {highlighted && completion.kind === 16 && completion.documentation ? (
        <span className="max-w-[128px] truncate pl-4 text-right text-neutral-300">
          {typeof completion.documentation === "string"
            ? completion.documentation
            : ""}
        </span>
      ) : null}
    </li>
  );
};
