import { useState, useRef, useCallback } from "react";
import { useCombobox, UseComboboxProps } from "downshift";
import fuzzysort from "fuzzysort";

import { update } from "./undate";
import { getMatches, replace } from "./utils";
import { List } from "./list";

export interface CompleteItem {
  documentation?: string;
  detail?: string;
  kind: 9 | 16 | 21;
  label: string;
  sortText: string;
  textEdit: {
    newText: string;
  };
  data: string | string[];
}

export type FuzzysortResults = Fuzzysort.KeyResults<CompleteItem>;

export interface AutocompleteProps
  extends Omit<UseComboboxProps<CompleteItem>, "items"> {
  completions: CompleteItem[];
  inputValue: string;
  onChange: (value: string) => void;
  onEnter: (item: string) => void;
}

export function Autocomplete({
  completions,
  inputValue,
  onChange,
  onEnter,
  ...props
}: AutocompleteProps) {
  const listRef = useRef<unknown | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [inputItems, setInputItems] = useState(completions);
  const fuzzySort = useRef<FuzzysortResults>();

  const scrollToItem = useCallback((highlightedIndex: number | undefined) => {
    if (listRef.current !== null) {
      (listRef.current as any).scrollToItem(highlightedIndex);
    }
  }, []);

  const itemToString = useCallback((item: CompleteItem | null) => {
    return item?.label || "";
  }, []);

  function getBeforeCursor() {
    if (!inputRef.current) return null;
    return inputRef.current.selectionStart !== inputRef.current.selectionEnd
      ? null
      : inputRef.current.value.substring(
          0,
          inputRef.current.selectionEnd as number
        );
  }

  const getAfterCursor = () => {
    if (!inputRef.current || inputRef.current.selectionEnd === null)
      return null;
    return inputRef.current.value.substring(inputRef.current.selectionEnd);
  };

  const applySearchResult = (searchResult: string | null | undefined): void => {
    if (searchResult === null || searchResult === undefined) return;
    const beforeCursor = getBeforeCursor();
    if (beforeCursor != null && inputRef.current) {
      const replaced = replace(
        searchResult,
        beforeCursor,
        getAfterCursor() || ""
      );
      inputRef.current.focus(); // Clicking a dropdown item removes focus from the element.
      if (Array.isArray(replaced)) {
        update(inputRef.current, replaced[0], replaced[1]);
        onChange(inputRef.current.value);
      }
    }
  };

  function getSearchTerm(str: string) {
    const beforeCursor = getBeforeCursor();
    if (beforeCursor === null) return str;
    let term = str;
    const matches = getMatches(beforeCursor);

    if (matches) {
      term = matches[2];
    }
    return term;
  }

  const search = (className: string | undefined) => {
    if (!className) {
      fuzzySort.current = undefined;
      setInputItems([]);
      return;
    }
    const term = getSearchTerm(className);
    // const result = completions.filter((i) => i.label.includes(term || ""));
    const results = fuzzysort.go(term, completions, {
      key: "label",
    });
    const sorted = [...results];
    sorted.sort(
      (a, b) =>
        b.score - a.score ||
        a.target.localeCompare(b.target, undefined, { numeric: true })
    );
    const newCompletions = sorted.map((result) => result.obj);
    fuzzySort.current = sorted as any;
    setInputItems(newCompletions);
  };

  const {
    isOpen,
    highlightedIndex,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
  } = useCombobox<CompleteItem>({
    inputValue,
    defaultHighlightedIndex: -1,
    defaultIsOpen: false,
    items: inputItems,
    itemToString,
    onInputValueChange: ({ inputValue, type }) => {
      if (type === useCombobox.stateChangeTypes.InputKeyDownEnter) return;
      search(inputValue);
    },
    onStateChange: (changes) => {
      // eslint-disable-next-line no-prototype-builtins
      if (changes.hasOwnProperty("highlightedIndex")) {
        scrollToItem(changes.highlightedIndex);
      }

      switch (changes.type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          applySearchResult(changes.selectedItem?.label || changes.inputValue);
          return;
        default:
          break;
      }
    },
    stateReducer(_, actionAndChanges) {
      const { type, changes } = actionAndChanges;
      // console.log("stateReducer", changes);
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
          search(changes.inputValue);
          break;
        default:
          break;
      }
      return changes;
    },
    ...props,
  });

  const { innerRef, ...inputProps } = getInputProps({
    id: "autocomplete",
    refKey: "innerRef",
    type: "text",
    autoCorrect: "off",
    spellCheck: "false",
    autoComplete: "off",
    placeholder: "Add class...",
    className: "font-mono w-full",
    onChange: (e) => {
      // console.log('onChange', (e.target as HTMLInputElement).value);
      onChange((e.target as HTMLInputElement).value);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        e.stopPropagation();
        if (inputItems.length === 0 || highlightedIndex === -1) {
          onEnter(inputValue);
          onChange("");
        }
      }

      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  });

  return (
    <div className="relative h-7 border-b border-neutral-300 bg-white font-mono text-xs dark:border-neutral-700 dark:bg-neutral-800">
      <div {...getComboboxProps()} className="flex w-full ">
        <input
          {...inputProps}
          className="h-[27px] w-full border border-transparent px-1 text-xs focus:border-blue-500 focus:outline-none dark:bg-neutral-800"
          ref={(ref) => {
            innerRef(ref);
            inputRef.current = ref;
          }}
        />
      </div>
      <div
        {...getMenuProps()}
        className="absolute left-0 z-50 w-full max-w-[384px] origin-top-right outline-none"
      >
        {isOpen && inputItems.length > 0 && (
          <div className="rounded-none border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
            {/* Max height = 20 * 12 */}
            <ul className="child-overscroll-contain relative leading-5 text-neutral-900 dark:text-white">
              <List
                ref={listRef}
                highlightedIndex={highlightedIndex}
                getItemProps={getItemProps}
                completions={inputItems}
                fuzzySort={fuzzySort.current}
              />
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
