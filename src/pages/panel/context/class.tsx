import React, { createContext, memo, useContext } from "react";
import { ClassList } from "../hooks";
import { SandboxContextType } from "./sandbox";

export interface ClassProviderProps {
  children: React.ReactNode;
  classList: ClassList;
  selectedClass: string;
  setSelectedClass: (newSelectedClass: string) => void;
  onToggleClass: (className: string, checked: boolean) => void;
  onResolveColor: SandboxContextType["resolveColor"];
  onResolveClassName: SandboxContextType["resolveClassName"];
}
const ClassListContext = createContext<Omit<ClassProviderProps, "children">>({
  classList: [],
  selectedClass: "",
  setSelectedClass: () => null,
  onToggleClass: () => null,
  onResolveColor: async () => undefined,
  onResolveClassName: async () => undefined,
});
ClassListContext.displayName = "ClassListContext";

export const ClassListProvider: React.FC<ClassProviderProps> = memo(
  ({ children, ...props }) => {
    return (
      <ClassListContext.Provider value={props}>
        {children}
      </ClassListContext.Provider>
    );
  }
);

export const useClassController = () => useContext(ClassListContext);
