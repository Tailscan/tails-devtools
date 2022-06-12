import { useEffect, useRef } from "react";

/**
 * Calls fn on component updates based on deps array.
 */
export const useUpdate = (fn: () => void, deps: unknown[]) => {
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fn();
    }
  }, deps);
};
