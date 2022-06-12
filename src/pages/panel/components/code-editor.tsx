import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { Extension } from "@codemirror/state";
import { useState } from "react";

import { useTheme } from "../context/theme";
import { useMount } from "../hooks";

const langs: Record<string, any> = {
  javascript,
  jsx: () => javascript({ jsx: true }),
  css,
};
export function CodeEditor(props: ReactCodeMirrorProps) {
  const [extensions, setExtensions] = useState<Extension[]>();
  const { themeName } = useTheme();

  useMount(() => {
    setExtensions([langs[props.lang || "jsx"]()]);
  });

  return (
    <CodeMirror
      height="100vh"
      extensions={extensions}
      theme={themeName}
      {...props}
    />
  );
}
