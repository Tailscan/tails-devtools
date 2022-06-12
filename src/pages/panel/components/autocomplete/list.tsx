import { forwardRef } from "react";
import { UseComboboxGetItemPropsOptions } from "downshift";
import { FixedSizeList } from "react-window";

import { useWindowSize } from "@panel/hooks";
import { CompleteItem, FuzzysortResults } from ".";
import { AutocompleteItem } from "./item";

export interface ListProps {
  completions: CompleteItem[];
  highlightedIndex: number;
  getItemProps: (options: UseComboboxGetItemPropsOptions<CompleteItem>) => any;
  fuzzySort?: FuzzysortResults;
}

const counts = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220];
const MAX_HEIGHT = 240;
const ROW_HEIGHT = 28;

const getListHeight = (height: number) => {
  let listHeight = MAX_HEIGHT;
  const avaiableHeight = height - ROW_HEIGHT * 2;
  if (avaiableHeight <= MAX_HEIGHT) {
    if (avaiableHeight > 84) {
      listHeight = height - 84;
    } else {
      listHeight = height / 2;
    }
  }
  return counts.reduce(function (prev, curr) {
    return Math.abs(curr - listHeight) < Math.abs(prev - listHeight)
      ? curr
      : prev;
  });
};

export const List = forwardRef<any, ListProps>(
  ({ highlightedIndex, getItemProps, completions, fuzzySort }, ref) => {
    const { height = 0 } = useWindowSize();
    const fullHeight = completions.length * 20;
    const listHeight = getListHeight(height);
    return (
      <FixedSizeList
        ref={ref}
        width="100%"
        height={fullHeight > listHeight ? listHeight : fullHeight}
        itemCount={completions.length}
        itemSize={20}
        itemData={{
          completions,
          fuzzySort,
          highlightedIndex,
          getItemProps,
        }}
      >
        {AutocompleteItem}
      </FixedSizeList>
    );
  }
);
