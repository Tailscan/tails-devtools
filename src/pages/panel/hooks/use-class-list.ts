import fuzzysort from "fuzzysort";
import { className } from "postcss-selector-parser";
import * as React from "react";

import { bridge } from "../bridge";
import { useCopyToClipboard } from "./use-copy";
import { useMount } from "./use-mount";

type MapClassList = Map<string, boolean>;

export type ClassItem = {
  className: string;
  checked: boolean;
};

export type ClassList = ClassItem[];

const toArray = (map: Map<string, boolean>) => {
  return Array.from(map, ([className, checked]) => ({ className, checked }));
};

const toMap = (array: { className: string; checked: boolean }[]) => {
  const map = new Map();
  array.forEach((element) => {
    map.set(element.className, element.checked);
  });
  return map;
};

export const useClassList = ({ onReset }: { onReset?: () => void }) => {
  const [_, copy] = useCopyToClipboard();

  const [filterValue, setFilterValue] = React.useState("");

  const [mapClassList, _setMapClassList] = React.useState<MapClassList>(
    new Map()
  );
  const fuzzySort = React.useRef<MapClassList>(mapClassList);

  const setMapClassList = React.useCallback((newMapClassList: MapClassList) => {
    fuzzySort.current = newMapClassList;
    _setMapClassList(newMapClassList);
  }, []);

  const handleFilterChange = React.useCallback(
    (newFilterValue: string) => {
      setFilterValue(newFilterValue);
      if (!newFilterValue.trim()) {
        fuzzySort.current = mapClassList;
        return;
      }
      const target = toArray(mapClassList);
      const results = fuzzysort.go(newFilterValue, target, {
        key: "className",
        all: true,
      });
      const sorted = [...results];
      sorted.sort(
        (a, b) =>
          b.score - a.score ||
          a.target.localeCompare(b.target, undefined, { numeric: true })
      );
      fuzzySort.current = toMap(sorted.map((item) => item.obj));
    },
    [mapClassList]
  );

  const handleFetchElement = React.useCallback(async () => {
    const inspectedElement = await bridge.fetchElement();
    const newMapClassList = toMap(
      (inspectedElement?.classes || []).map((className) => ({
        className,
        checked: true,
      }))
    );
    setMapClassList(newMapClassList);
  }, []);

  const handleToggleClass = React.useCallback(
    async (className: string, checked: boolean) => {
      bridge.toggleClass(className, checked);
      mapClassList.set(className, checked);
      setMapClassList(new Map(mapClassList));
    },
    [mapClassList]
  );

  const handleCopy = React.useCallback(() => {
    const checkedClassList = toArray(mapClassList).filter(
      (className) => className.checked
    );
    const copyText = checkedClassList
      .map((className) => className.className)
      .join(" ");
    console.log(copyText);
    copy(copyText);
  }, [mapClassList, copy]);

  const resetState = React.useCallback(() => {
    setFilterValue("");
    onReset?.();
  }, []);

  React.useEffect(() => {
    const unsubscribe = bridge.onSelectionChanged((inspectedElement) => {
      resetState();
      const newMapClassList = toMap(
        (inspectedElement?.classes || []).map((className) => ({
          className,
          checked: true,
        }))
      );
      setMapClassList(newMapClassList);
    });

    return unsubscribe;
  }, []);

  useMount(() => {
    handleFetchElement();
  });

  return {
    classList: toArray(fuzzySort.current),
    filterValue,
    handleFilterChange,
    handleFetchElement,
    handleToggleClass,
    handleCopy,
  };
};
