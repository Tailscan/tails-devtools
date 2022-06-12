import { useEffect } from "react";

export const useMount = (fn: () => void) => {
  useEffect(() => {
    fn();
  }, []);
};
