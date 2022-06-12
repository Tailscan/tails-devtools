import fuzzysort from "fuzzysort";
import * as React from "react";

import { bridge } from "../bridge";
import { InspectedElement } from "../remote";
import { sortClassArray } from "../sortClasses";
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
  const [copied, copy] = useCopyToClipboard();

  const [filterValue, setFilterValue] = React.useState("");

  const [inspectedEl, setInspectedEl] = React.useState<InspectedElement>();
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
    const sortedClasses = sortClassArray(inspectedElement?.classes || []);
    const newMapClassList = toMap(
      sortedClasses.map((className) => ({
        className,
        checked: true,
      }))
    );
    setInspectedEl(inspectedElement);
    setMapClassList(newMapClassList);
  }, []);

  const handleToggleClass = React.useCallback(
    async (className: string, checked: boolean) => {
      mapClassList.set(className, checked);
      setMapClassList(new Map(mapClassList));
      handleFilterChange(filterValue);
      const activeClassList = toArray(mapClassList).filter(
        (className) => className.checked
      );
      const classStr = activeClassList
        .map((className) => className.className)
        .join(" ");
      await bridge.setClassList(classStr);
    },
    [mapClassList, filterValue, handleFilterChange]
  );

  const handleSetClassList = React.useCallback(
    async (classList: string) => {
      const classNames = classList.split(/[\s+]/);
      const promises: Promise<void>[] = [];
      classNames.forEach((className) => {
        promises.push(handleToggleClass(className, true));
      });
      await Promise.all(promises);
    },
    [handleToggleClass]
  );

  const handleCopy = React.useCallback(() => {
    const activeClassList = toArray(mapClassList).filter(
      (className) => className.checked
    );
    const copyText = activeClassList
      .map((className) => className.className)
      .join(" ");
    copy(copyText);
  }, [mapClassList, copy]);

  const resetState = React.useCallback(() => {
    setFilterValue("");
    onReset?.();
  }, []);

  React.useEffect(() => {
    const unsubscribe = bridge.onSelectionChanged((inspectedElement) => {
      resetState();
      const sortedClasses = sortClassArray(inspectedElement?.classes || []);
      const newMapClassList = toMap(
        sortedClasses.map((className) => ({
          className,
          checked: true,
        }))
      );
      setInspectedEl(inspectedElement);
      setMapClassList(newMapClassList);
    });

    return unsubscribe;
  }, []);

  useMount(() => {
    handleFetchElement();
  });

  return {
    inspectedEl,
    classList: toArray(fuzzySort.current),
    filterValue,
    copied,
    handleFilterChange,
    handleFetchElement,
    handleToggleClass,
    handleSetClassList,
    handleCopy,
  };
};
